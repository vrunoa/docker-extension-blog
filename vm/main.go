package main

import (
	"context"
	"flag"
	"fmt"
	"strconv"

	"net"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo"
	"github.com/mmcdole/gofeed"
	"github.com/sirupsen/logrus"
)

const (
	dockerFeed = "https://www.docker.com/feed"
)

var logger = logrus.New()

func main() {
	var socketPath string
	flag.StringVar(&socketPath, "socket", "/run/guest/volumes-service.sock", "Unix domain socket to listen on")
	flag.Parse()

	os.RemoveAll(socketPath)

	logger.Infof("starting listening on %s\n", socketPath)
	router := echo.New()
	router.HideBanner = true

	startURL := ""

	ln, err := listen(socketPath)
	if err != nil {
		logrus.Fatal(err)
	}
	router.Listener = ln

	router.GET("/feed", getFeed)
	logger.Fatal(router.Start(startURL))
}

func listen(path string) (net.Listener, error) {
	return net.Listen("unix", path)
}

func getPageParam(ctx echo.Context) (int, error) {
	pageParam := ctx.QueryParam("page")
	page, err := strconv.Atoi(pageParam)
	if err != nil {
		return 1, err
	}
	return page, nil
}

func getFeed(ctx echo.Context) error {
	fp := gofeed.NewParser()
	page, err := getPageParam(ctx)
	if err != nil {
		logrus.Warnf("failed to get feed: %v", err.Error())
		return ctx.JSON(http.StatusInternalServerError, HTTPMessageBody{Error: err.Error()})
	}
	cont, cancel := context.WithTimeout(ctx.Request().Context(), time.Second*60)
	defer cancel()
	feedUrl := fmt.Sprintf("%s?paged=%d", dockerFeed, page)
	logger.Debugf("getting feed -> %s", feedUrl)
	feedRaw, err := fp.ParseURLWithContext(feedUrl, cont)
	if err != nil {
		logrus.Warnf("failed to get feed: %v", err.Error())
		return ctx.JSON(http.StatusInternalServerError, HTTPMessageBody{Error: err.Error()})
	}
	return ctx.JSON(http.StatusOK, HTTPMessageBody{Feed: feedRaw})
}

type HTTPMessageBody struct {
	Error string
	Feed  *gofeed.Feed
}
