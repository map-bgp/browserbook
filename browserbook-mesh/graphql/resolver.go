package graphql

import "github.com/map-bgp/browserbook/browserbook-mesh/core"

type Resolver struct {
	app *core.App
}

func NewResolver(app *core.App) *Resolver {
	return &Resolver{
		app: app,
	}
}
