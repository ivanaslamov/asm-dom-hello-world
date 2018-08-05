#ifndef asmdom_app_helpers_hpp
#define asmdom_app_helpers_hpp

#include <string>

namespace app {
	namespace helpers {

		std::string classnames(std::map<std::string, bool> classes);
		std::wstring utf8_to_wstring(const std::string& str);
		std::string wstring_to_utf8(const std::wstring& str);

	}
}

#endif
