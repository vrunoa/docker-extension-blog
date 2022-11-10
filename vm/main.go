package main

import (
	"flag"

	"docker-extension-blog/internal/handler"
	"docker-extension-blog/internal/logger"
	"docker-extension-blog/internal/store"

	"net"
	"os"

	"github.com/go-redis/redis/v8"
	"github.com/labstack/echo"
	"github.com/sirupsen/logrus"
)

func main() {
	var socketPath string
	flag.StringVar(&socketPath, "socket", "/run/guest/volumes-service.sock", "Unix domain socket to listen on")
	flag.Parse()

	os.RemoveAll(socketPath)

	logger.Init(&logrus.JSONFormatter{})
	logger.Infof("starting listening on %s\n", socketPath)
	router := echo.New()
	router.HideBanner = true

	startURL := ""

	ln, err := listen(socketPath)
	if err != nil {
		logrus.Fatal(err)
	}
	router.Listener = ln

	r := redis.NewClient(&redis.Options{
		Addr:     "redis-docker-extension-blog:6379",
		Password: "",
		DB:       0,
	})

	s := store.New(r)
	h := handler.New(s)

	router.GET("/feed", h.FetchFeed)
	logger.Fatal(router.Start(startURL))
}

func listen(path string) (net.Listener, error) {
	return net.Listen("unix", path)
}
