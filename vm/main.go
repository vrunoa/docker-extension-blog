package main

import (
	"context"
	"encoding/json"
	"flag"
	"github.com/mmcdole/gofeed"
	"log"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo"
	"github.com/sirupsen/logrus"
)

const (
	dockerFeed = "https://www.docker.com/feed/"
)

func main() {
	var socketPath string
	flag.StringVar(&socketPath, "socket", "/run/guest/volumes-service.sock", "Unix domain socket to listen on")
	flag.Parse()

	os.RemoveAll(socketPath)

	logrus.New().Infof("Starting listening on %s\n", socketPath)
	router := echo.New()
	router.HideBanner = true

	startURL := ""

	ln, err := listen(socketPath)
	if err != nil {
		log.Fatal(err)
	}
	router.Listener = ln

	router.GET("/feed", getFeed)
	log.Fatal(router.Start(startURL))
}

func listen(path string) (net.Listener, error) {
	return net.Listen("unix", path)
}

func getFeed(ctx echo.Context) error {
	fp := gofeed.NewParser()
	cont, cancel := context.WithTimeout(context.Background(), time.Second*60)
	defer cancel()
	feedRaw, err := fp.ParseURLWithContext(dockerFeed, cont)
	if err != nil {
		return err
	}

	dat, err := json.Marshal(feedRaw)
	if err != nil {
		return err
	}
	log.Println(dat)
	return ctx.JSON(http.StatusOK, HTTPMessageBody{Feed: feedRaw})
}

type HTTPMessageBody struct {
	Feed *gofeed.Feed
}
