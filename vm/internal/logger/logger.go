package logger

import (
	"github.com/sirupsen/logrus"
)

var logger = logrus.New()

func Init(f logrus.Formatter) {
	logger.SetFormatter(f)
	logger.SetLevel(logrus.InfoLevel)
}

func Warnf(format string, args ...interface{}) {
	logger.Warnf(format, args...)
}

func Infof(format string, args ...interface{}) {
	logger.Infof(format, args...)
}

func Debug(args ...interface{}) {
	logger.Debug(args...)
}

func Fatal(args ...interface{}) {
	logger.Fatal(args...)
}
