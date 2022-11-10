package handler

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo"
	"github.com/mmcdole/gofeed"

	"docker-extension-blog/internal/logger"
	"docker-extension-blog/internal/store"
)

const (
	dockerFeed   = "https://www.docker.com/feed"
	cacheKey     = "feed"
	cacheTimeout = time.Minute * 1
)

type handler struct {
	store  store.Store
	parser *gofeed.Parser
}

type HTTPMessageBody struct {
	Error string
	Feed  *gofeed.Feed
}

func getPageParam(ctx echo.Context) (int, error) {
	pageParam := ctx.QueryParam("page")
	page, err := strconv.Atoi(pageParam)
	if err != nil {
		logger.Warnf("warn -> %v", err)
		return 1, err
	}
	return page, nil
}

func (h *handler) getCache(ctx context.Context) (*string, error) {
	feedRaw, err := h.store.Get(ctx, cacheKey)
	if err != nil {
		return nil, err
	}
	if feedRaw == "" {
		return nil, errors.New("empty cache")
	}
	return &feedRaw, nil
}

func (h *handler) getCacheFeed(ctx context.Context) (*gofeed.Feed, error) {
	feedRaw, err := h.getCache(ctx)
	if err != nil {
		return nil, err
	}
	feed, err := h.parser.ParseString(*feedRaw)
	if err != nil {
		return nil, err
	}
	return feed, nil
}

func (h *handler) saveCache(ctx context.Context, value string) error {
	return h.store.Set(ctx, "feed", value, cacheTimeout)
}

func (h *handler) requestFeed(ctx context.Context, page int) (*string, error) {
	feedUrl := fmt.Sprintf("%s?paged=%d", dockerFeed, page)
	client := http.Client{}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, feedUrl, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("User-Agent", "vrunoa/docker-extension-blog")
	logger.Infof("getting feed: %s", feedUrl)
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := io.ReadAll(res.Body)
	defer res.Body.Close()
	if err != nil {
		return nil, err
	}
	feed := string(body)
	return &feed, err
}

func (h *handler) getFeed(ctx context.Context, page int) (*gofeed.Feed, *string, error) {
	feedRaw, err := h.requestFeed(ctx, page)
	if err != nil {
		return nil, nil, err
	}
	feed, err := h.parser.ParseString(*feedRaw)
	if err != nil {
		return nil, nil, err
	}
	return feed, feedRaw, nil
}

func (h *handler) FetchFeed(ectx echo.Context) error {

	page, err := getPageParam(ectx)
	if err != nil {
		logger.Warnf("failed to page param: %v", err.Error())
		page = 1
	}

	ctx, cancel := context.WithTimeout(ectx.Request().Context(), time.Second*60)
	defer cancel()

	feed, err := h.getCacheFeed(ctx)
	if err == nil && feed != nil && page == 1 {
		logger.Info("using cache")
		return ectx.JSON(http.StatusOK, HTTPMessageBody{Feed: feed})
	}

	feed, raw, err := h.getFeed(ctx, page)
	if err != nil {
		return ectx.JSON(http.StatusInternalServerError, HTTPMessageBody{Error: err.Error()})
	}
	//  only caching first page now
	if page == 1 {
		h.saveCache(ctx, *raw)
	}
	return ectx.JSON(http.StatusOK, HTTPMessageBody{Feed: feed})
}

func New(s store.Store) *handler {
	return &handler{
		store:  s,
		parser: gofeed.NewParser(),
	}
}
