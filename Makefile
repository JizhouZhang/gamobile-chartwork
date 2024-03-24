.PHONY: build-android

build-android:
	@echo "Extracting version from package.json"
	$(eval VERSION=$(shell jq -r '.version' package.json))
	$(eval MAJOR=$(shell echo $(VERSION) | cut -d'.' -f1))
	$(eval MINOR=$(shell echo $(VERSION) | cut -d'.' -f2))
	$(eval PATCH=$(shell echo $(VERSION) | cut -d'.' -f3))
	$(eval NEW_PATCH=$(shell echo $$(( $(PATCH) + 1 ))))
	$(eval NEW_VERSION=$(MAJOR).$(MINOR).$(NEW_PATCH))

	@echo "Bumping version to $(NEW_VERSION)"
	jq '.version="$(NEW_VERSION)"' package.json > temp.json && mv temp.json package.json
	
	@echo "Building the APK"
	cd android && ./gradlew assembleRelease
	
	@echo "Copying APK to build directory with version $(NEW_VERSION)"
	$(shell mkdir -p build)
	$(eval APK_PATH=$(shell find android/app/build/outputs/apk/release -name "*.apk"))
	cp $(APK_PATH) build/app-release-$(NEW_VERSION).apk
	
	@echo "Build complete. APK is available in the build directory with version $(NEW_VERSION)."

build-ios:
	@echo "Building iOS..."
	@cd ios && xcodebuild -workspace Runner.xcworkspace -scheme Runner -sdk iphoneos -configuration Release -derivedDataPath ios/build