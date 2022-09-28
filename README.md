# react-native-sk-linkedmap

**Create and show maps with position linking and more...**

## Parameter

activePosition [optional]
```jruby
Type: TPosition
Active position is focused.
```

customAnimation [optional]
```jruby
Type: typeof Animated.View
Allows the user to set own custom position animation.
```

editMode [optional]
```jruby
Type: Boolean
Enables edit mode to edit map & positions.
```

hidePositions [optional]
```ruby
Type: Boolean
If enabled, positions won't be visible on the map (only active position).
```

map
```ruby
Type: TMap
Shows the map (and positions).
```

onChange (map) [optional]
```ruby
Type: (TMap) => Void
Called when the map / positions are changed.
```

onClick (position) [optional]
```ruby
Type: (TPosition) => Void
Called when a position is clicked/pressed.
```

positionStyle [optional]
```ruby
Type: ViewStyle
Changes the style of the positions.
```

showMenu [optional]
```ruby
Type: Boolean
Shows a menu button to edit maps & positions. Deprecated, use editMode instead.
```

showZoomButtons [optional]
```ruby
Type: Boolean
Shows zoom-in, zoom-out & reset-zoom buttons (web-only).
```

style [optional]
```ruby
Type: ViewStyle
Changes the style of the component.
```

testID [optional]
```ruby
Type: String
Used to locate this component in end-to-end tests.
```

title [optional]
```ruby
Type: String
Shows the title above the map.
```

titleStyle [optional]
```ruby
Type: TextStyle
Changes the style of the title.
```

zoomButtonsStyle [optional]
```ruby
Type: ViewStyle | TextStyle
Changes the style of the zoom buttons.
```
