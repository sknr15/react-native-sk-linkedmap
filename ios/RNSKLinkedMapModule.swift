//
//  RNSKLinkedMapModule.swift
//  RNSKLinkedMapModule
//
//  Copyright © 2022 Simon Konrad. All rights reserved.
//

import Foundation

@objc(RNSKLinkedMapModule)
class RNSKLinkedMapModule: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
