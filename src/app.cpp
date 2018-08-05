#include "../asm-dom/cpp/asm-dom.hpp"
#include "counter.hpp"
#include <emscripten.h>
#include <emscripten/bind.h>

using namespace asmdom;
using namespace app::counter;

std::function<void(app::counter::action)> handler;

void render(Counter initState, VNode* oldVnode);

VNode* nextVnode;

VNode* beforePatch(Counter initState) {
	handler = [initState](std::function<Counter(Counter)> e) {
		Counter newState = update(initState, e);
		render(newState, nextVnode);
	};
	nextVnode = view(initState, handler);
	return nextVnode;
};

void render(Counter initState, VNode* oldVnode) {
	VNode* newVnode = beforePatch(initState);
	patch(oldVnode, newVnode);
};

void render(Counter initState, emscripten::val oldVnode) {
	VNode* newVnode = beforePatch(initState);
	patch(oldVnode, newVnode);
};

int main() {
	Config config = Config();
	init(config);

	render(
		app::counter::init(),
		emscripten::val::global("document").call<emscripten::val>(
			"querySelector",
			std::string(".app")
		)
	);
	return 0;
};
