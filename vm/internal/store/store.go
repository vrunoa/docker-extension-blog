package store

import (
	"context"
	"time"

	"github.com/go-redis/redis/v8"
)

type store struct {
	client *redis.Client
}

type Store interface {
	Set(ctx context.Context, key string, value string, t time.Duration) error
	Get(ctx context.Context, key string) (string, error)
}

func (s *store) Set(ctx context.Context, key string, value string, t time.Duration) error {
	return s.client.Set(ctx, key, value, t).Err()
}

func (s *store) Get(ctx context.Context, key string) (string, error) {
	return s.client.Get(ctx, key).Result()
}

func New(client *redis.Client) *store {
	return &store{
		client: client,
	}
}
