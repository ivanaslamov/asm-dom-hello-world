#include "../asm-dom/cpp/asm-dom.hpp"
#include "counter.hpp"
#include "helpers.hpp"
#include <emscripten/val.h>
#include <functional>
#include <algorithm>
#include <vector>
#include <string>

using namespace app::helpers;

namespace app {

	namespace counter {

		namespace Action {

			action Increment() {
				return [](Counter model) -> Counter {
					model.count++;
					return model;
				};
			};

			action Decrement() {
				return [](Counter model) -> Counter {
					model.count--;
					return model;
				};
			};

		}

		bool onClick(emscripten::val e) {
			emscripten::val::global("console").call<void>("log", emscripten::val("clicked"));
			return true;
		};

		VNode* view(Counter model, std::function<void(action)> handler) {
			return h("section",
				Data(
					Attrs {
						{"class", "todoapp"}
					},
					Callbacks {
						{"onclick", onClick}
					}
				),
				Children {
					h("header",
						Data(
							Attrs {
								{"class", "header"}
							}
						),
						Children {
							h(std::string("h1"), std::string("Hello World")),
							h("input",
								Data(
									Attrs {
										{"id", "new-todo"},
										{"type", "button"},
										{"class", "new-todo"},
									},
									Props {
										{"value", emscripten::val(model.count)}
									},
									Callbacks {
										{"onclick", [handler](emscripten::val e) -> bool {
											handler(Action::Increment());
											return true;
										}}
									}
								)
							)
						}
					)
				}
			);
		};

		Counter init() {
			return init(0);
		};

		Counter init(int count) {
			Counter model;
			model.count = count;
			return model;
		};

		Counter update(Counter counter, action act) {
			return act(counter);
		};
	}
}
