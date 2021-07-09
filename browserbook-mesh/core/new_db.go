// +build !js

package core

import (
	"context"
	"path/filepath"

	"github.com/map-bgp/browserbook/browserbook-mesh/db"
)

func newDB(ctx context.Context, config Config) (*db.DB, error) {
	databasePath := filepath.Join(config.DataDir, "sqlite-db", "db.sqlite")
	return db.New(ctx, &db.Options{
		DriverName:     "sqlite3",
		DataSourceName: databasePath,
		MaxOrders:      config.MaxOrdersInStorage,
	})
}
