// +build js,wasm

package db

import (
	"syscall/js"

	"github.com/bbook/0x-mesh/jsutil"
)

func (opts *Options) JSValue() js.Value {
	value, _ := jsutil.InefficientlyConvertToJS(opts)
	return value
}

func (query *OrderQuery) JSValue() js.Value {
	if query == nil {
		return js.Null()
	}
	value, err := jsutil.InefficientlyConvertToJS(query)
	if err != nil {
		// Should never happen
		panic(err)
	}
	return value
}

func (query *MiniHeaderQuery) JSValue() js.Value {
	if query == nil {
		return js.Null()
	}
	value, err := jsutil.InefficientlyConvertToJS(query)
	if err != nil {
		// Should never happen
		panic(err)
	}
	return value
}
