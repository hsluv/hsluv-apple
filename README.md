# HSLuvSwift

[![SwiftPM compatible](https://img.shields.io/badge/SwiftPM-compatible-brightgreen.svg)](https://swift.org/package-manager/)
[![Build Status](https://github.com/hsluv/hsluv-swift/actions/workflows/ci.yml/badge.svg)](https://github.com/hsluv/hsluv-swift/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT%20License-blue.svg)](LICENSE)

Swift port of [HSLuv](http://www.hsluv.org) (revision 4), courtesy 
of [Clay Smith](https://github.com/stphnclysmth), [Alexei Boronine](https://github.com/boronine), [Gemini 2.5 Pro](https://deepmind.google/models/gemini/pro/).

[Explanation, demo, ports etc.](http://www.hsluv.org)

## USAGE



## INSTALL

This project is installable from Swift Package Manager. CocoaPods and Carthage are no longer supported, but we recommend you simply vendor the [source file](./Sources/HSLuv.swift) if SPM is not available.

#### Swift Package Manager

Add the following to your `Package.swift`:

```swift
.package(url: "https://github.com/hsluv/hsluv-swift.git", from: "3.0.0"),
```

## TODO

* Finish HPLuv implementation
* Improve tests and add continuous integration testing
* Add usage documentation

## License

See [License](LICENSE)
