package logger

import (
	"github.com/sirupsen/logrus"
)

var logger = logrus.New()

func Init(f logrus.Formatter) {
	logger.SetFormatter(f)
}

func Warnf(format string, args ...interface{}) {
	logger.Warnf(format, args)
}

func Errorf(format string, args ...interface{}) {
	logger.Errorf(format, args)
}

func Infof(format string, args ...interface{}) {
	logger.Infof(format, args)
}

func Info(args ...interface{}) {
	logger.Info(args)
}

func Fatal(args ...interface{}) {
	logger.Fatal(args)
}
