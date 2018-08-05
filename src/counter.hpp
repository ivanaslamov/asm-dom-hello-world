#ifndef asmdom_app_todos_hpp
#define asmdom_app_todos_hpp

#include "../asm-dom/cpp/asm-dom.hpp"
#include <functional>
#include <vector>
#include <string>

using namespace asmdom;

namespace app {
	namespace counter {

		struct Counter {
			int count;
		};

		typedef std::function<Counter(Counter)> action;

		VNode* view(Counter counter, std::function<void(action)> handler);
		Counter init();
		Counter init(int count);
		Counter update(Counter counter, action act);

		namespace Action {
			action Increment();
			action Decrement();
		}
	}
}

#endif
