import React, { useEffect, useState, useRef } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import Modal from 'react-native-modal'
import { AddPosition, EditPosition } from './Position'
import { SearchBar, Text } from './Form'
import RBSheet from 'react-native-raw-bottom-sheet'
import Image from 'react-native-scalable-image'
import { TCoordinates, TMap, TPosition } from './interfaces'
import { Map, MapPicker } from './Map'

type TModalContentType =
  | 'addPosition'
  | 'editPosition'
  | 'showAllPositions'
  | 'changeMap'

type TContentType =
  | 'menu'
  | 'addPosition'
  | 'editPosition'
  | 'showAllPositions'
  | 'changeMap'

export type { TCoordinates, TMap, TPosition }

export const LinkedMap = ({
  activePosition,
  customAnimation,
  editMode,
  hidePositions,
  map,
  onChange,
  onClick,
  positionStyle,
  showMenu,
  showZoomButtons,
  style,
  testID,
  title,
  titleStyle,
  zoomButtonsStyle,
}: {
  /**
   * If set, provided position is focused.
   **/
  activePosition?: TPosition
  /**
   * Allows the user to set own custom animation for the positions.
   **/
  customAnimation?: typeof Animated.View
  /**
   * Enables edit mode to edit map and positions.
   **/
  editMode?: boolean
  /**
   * If enabled, positions are not shown on the map (only active position if activePosition is set).
   **/
  hidePositions?: boolean
  /**
   * Shows the map (and positions).
   **/
  map: TMap
  /**
   * Called when the map or positions are changed.
   **/
  onChange?: (map: TMap) => void
  /**
   * Called when a position is clicked/pressed.
   **/
  onClick?: (position?: TPosition) => void
  /**
   * Changes the style of the positions.
   **/
  positionStyle?: ViewStyle
  /**
   *  Shows a menu button to edit maps and positions. Deprecated, use editMode instead.
   **/
  showMenu?: boolean
  /**
   *  Shows zoom-in, zoom-out and reset-zoom buttons (web-only).
   **/
  showZoomButtons?: boolean
  /**
   *  Changes the style of the component.
   **/
  style?: ViewStyle
  /**
   *  Used to locate this component in end-to-end tests.
   **/
  testID?: string
  /**
   *  Shows the title above the map.
   **/
  title?: string
  /**
   *  Changes the style of the title. Only works when "title" is set.
   **/
  titleStyle?: TextStyle
  /**
   *  Changes the style of the zoom buttons. Only works if "showZoomButtons" is set.
   **/
  zoomButtonsStyle?: ViewStyle & TextStyle
}) => {
  const acceptIcon = require('./Assets/accept.png')
  const closeIcon = require('./Assets/close.png')

  const IS_WEB = Platform.OS === 'web'

  const [optionText, setOptionText] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const [modalContentType, setModalContentType] =
    useState<TModalContentType>('showAllPositions')
  const [contentType, setContentType] = useState<TContentType>('menu')

  const [mapPositions, setMapPositions] = useState<TPosition[]>([])
  const [tempPositions, setTempPositions] = useState<typeof mapPositions>([])
  const [searchedPositions, setSearchedPositions] = useState<
    typeof tempPositions
  >([])

  const [searchTerm, setSearchTerm] = useState<string>('')

  const [tempMap, setTempMap] = useState<typeof map | undefined>(undefined)
  const [tempValues, setTempValues] = useState<{
    key?: string
    title: string
    target: string
    coordinates?: TCoordinates
  }>({ key: undefined, title: '', target: '', coordinates: undefined })

  const [activeKey, setActiveKey] = useState<string | undefined>(undefined)
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const [keyErrors, setKeyErrors] = useState<string[]>([])

  const bottomSheetRef = useRef<RBSheet | undefined>(undefined)

  useEffect(() => {
    if (map) {
      setTempMap(map)
      if (map.positions) {
        let keys = map.positions.map((position) => position.key)
        let duplicates: string[] = []
        keys.forEach((pos, idx) => {
          if (keys.indexOf(pos) !== idx) duplicates.push(pos)
        })

        setKeyErrors([...duplicates])

        if (duplicates.length === 0) {
          setMapPositions(
            map.positions.sort((a, b) => {
              if (a.title === b.title) return a.key.localeCompare(b.key)
              return a.title.localeCompare(b.title)
            })
          )
        }
      }
    }
  }, [map])

  useEffect(() => {
    if (mapPositions && map.key) {
      setTempPositions([...mapPositions])
    }
  }, [mapPositions])

  useEffect(() => {
    let _searched = [...tempPositions]
    if (searchTerm.length > 0) {
      _searched = _searched.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.key.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setSearchedPositions(_searched)
  }, [tempPositions, searchTerm])

  const _handleOnClick = (position: TPosition) => {
    if (onClick) {
      onClick(position)
    }
  }

  const _addPosition = (position: TPosition, key?: string) => {
    let _mapPos: typeof tempPositions = [...tempPositions]
    if (key) {
      if (_mapPos.find((pos) => pos.key === position.key)) {
        _mapPos = _mapPos.map((obj) => {
          if (obj.key === position.key) {
            return { ...obj, ...position }
          }

          return obj
        })
      } else {
        _mapPos?.push({ ...position })
      }
    } else {
      let _key = position.title.replace(/\s/g, '').toLowerCase()
      let i = 0
      while (true) {
        if (_mapPos?.find((e) => e.key === _key)) {
          _key = position.title.replace(/\s/g, '').toLowerCase() + '_' + i++
        } else {
          _mapPos?.push({ ...position, key: _key })
          break
        }
      }
    }
    setTempPositions(_mapPos)
  }

  const _renderManagePositions = () => {
    let _type = editMode ? contentType : modalContentType
    switch (_type) {
      case 'addPosition':
        return (
          <AddPosition
            testId={`${testID ?? 'linkedmap'}_mapposition_add`}
            map={map}
            onChangePosition={(position) => {
              setTempValues({ ...position })
              setHasChanges(true)
            }}
          />
        )
      case 'editPosition':
        const _activePosition = tempPositions.find((e) => e.key === activeKey)
        if (_activePosition) {
          return (
            <EditPosition
              testId={`${testID ?? 'linkedmap'}_mapposition_edit`}
              position={_activePosition}
              map={map}
              onChangePosition={(position) => {
                setTempValues({ ...position })
                setHasChanges(true)
              }}
            />
          )
        }

        return null
      case 'showAllPositions':
      default:
        return (
          <View style={{ flex: 1 }}>
            <View
              style={{
                marginBottom: 5,
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: '#448AFF',
                  borderRadius: 5,
                  width: IS_WEB ? 'auto' : '100%',
                  marginBottom: 5,
                }}
                onPress={() => {
                  setActiveKey(undefined)
                  setTempValues({ title: '', target: '' })
                  if (editMode) {
                    setContentType('addPosition')
                  } else {
                    setModalContentType('addPosition')
                  }
                }}
              >
                <Text style={{ fontSize: 16, color: 'white' }}>
                  Add position
                </Text>
              </TouchableOpacity>
              {tempPositions.length >= 5 && (
                <SearchBar
                  value={searchTerm}
                  placeholder={'Search...'}
                  onChangeText={(val) => setSearchTerm(val)}
                  onClear={() => setSearchTerm('')}
                  style={{ width: '100%', maxWidth: 600 }}
                />
              )}
            </View>
            <ScrollView>
              {searchedPositions.length > 0 ? (
                <View>
                  {searchedPositions
                    .sort((a, b) => {
                      if (a.title === b.title) return a.key.localeCompare(b.key)
                      return a.title.localeCompare(b.title)
                    })
                    .map((position, index) => {
                      const isLastItem = index === searchedPositions.length - 1
                      return (
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderBottomWidth: isLastItem ? 0 : 1,
                            paddingVertical: 5,
                          }}
                          key={`mapposition_${position.key}`}
                        >
                          <TouchableOpacity
                            testID={`${testID ?? 'linkedmap'}_mapposition_${
                              position.key
                            }_detail`}
                            onPress={() => {
                              setActiveKey(position.key)
                              setTempValues({
                                title: position.title,
                                target: position.target,
                              })
                              if (editMode) {
                                setContentType('editPosition')
                              } else {
                                setModalContentType('editPosition')
                              }
                            }}
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              paddingLeft: 10,
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'baseline',
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  paddingRight: 5,
                                }}
                              >
                                {position.title}
                              </Text>
                              <Text>{`(${position.key})`}</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            testID={`${testID ?? 'linkedmap'}_mapposition_${
                              position.key
                            }_delete`}
                            onPress={() => {
                              if (IS_WEB) {
                                const result = window.confirm(
                                  `Do you really want to delete this position?\n"${position.title}"`
                                )

                                if (result) {
                                  let _mapPos = tempPositions?.filter(
                                    (e) => e.key !== position.key
                                  )
                                  setTempPositions(_mapPos)
                                }
                              } else {
                                Alert.alert(
                                  'Delete?',
                                  `Do you really want to delete this position?\n"${position.title}"`,
                                  [
                                    {
                                      text: 'Cancel',
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'OK',
                                      onPress: () => {
                                        let _mapPos = tempPositions?.filter(
                                          (e) => e.key !== position.key
                                        )
                                        setTempPositions(_mapPos)
                                      },
                                      style: 'destructive',
                                    },
                                  ]
                                )
                              }
                            }}
                            style={{
                              justifyContent: 'center',
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                            }}
                          >
                            <Text style={{ color: 'red', fontSize: 16 }}>
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )
                    })}
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 16 }} center>
                    No positions found...
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )
    }
  }

  const _renderMapPicker = () => {
    return (
      <MapPicker
        testId={`${testID ?? 'linkedmap'}_mappicker`}
        map={map}
        onChange={(map) => {
          setTempMap({ ...map })
          setHasChanges(true)
        }}
      />
    )
  }

  const _renderModalContent = () => {
    if (editMode) {
      switch (contentType) {
        case 'changeMap':
          return _renderMapPicker()
        case 'showAllPositions':
        default:
          return _renderManagePositions()
      }
    }

    switch (optionText) {
      case 'Change map':
        return _renderMapPicker()
      case 'Manage positions':
      default:
        return _renderManagePositions()
    }
  }

  const _renderEditMode = () => {
    switch (contentType) {
      case 'menu':
        return (
          <View style={{ flex: 1 }}>
            <View
              style={{
                paddingBottom: 20,
              }}
            >
              {_renderMenu()}
            </View>
            <View style={{ flex: 1, borderWidth: 2 }}>
              <Map
                testId={`${testID ?? 'linkedmap'}_map`}
                customAnimation={customAnimation}
                hidePositions={hidePositions}
                map={map}
                showImageSize
                showPositionTitle={!hidePositions}
                zoomable
                positionStyle={positionStyle}
                showZoomButtons={false}
              />
            </View>
          </View>
        )
      default:
        return _renderModalContent()
    }
  }

  const _handleEditAction = (
    type: 'accept' | 'close',
    isDisabled?: boolean
  ) => {
    if (contentType === 'showAllPositions' || contentType === 'changeMap') {
      setSearchTerm('')
    }

    switch (type) {
      case 'accept':
        if (isDisabled) {
          return
        }
        if (contentType === 'showAllPositions') {
          setMapPositions(tempPositions)
          setContentType('menu')
          if (onChange) onChange({ ...map, positions: [...tempPositions] })
        } else {
          if (contentType === 'changeMap') {
            setContentType('menu')
            if (onChange && tempMap) onChange(tempMap)
          } else {
            if (tempValues) {
              _addPosition({ ...tempValues, key: activeKey ?? '' }, activeKey)
            }
            setContentType('showAllPositions')
          }
        }
        setHasChanges(false)
        setTempValues({ title: '', target: '' })
        break
      case 'close':
        if (contentType === 'menu') {
          return
        }
      default:
        if (
          (contentType === 'showAllPositions' &&
            JSON.stringify(tempPositions) !== JSON.stringify(mapPositions)) ||
          hasChanges
        ) {
          if (IS_WEB) {
            const result = window.confirm(
              'Do you really want to close? Any unsaved progress will be lost!'
            )

            if (result) {
              if (
                contentType === 'showAllPositions' ||
                contentType === 'changeMap'
              ) {
                setTempPositions([])
                setTempValues({ title: '', target: '' })
                setContentType('menu')
              } else {
                setContentType('showAllPositions')
              }
              setHasChanges(false)
            }
          } else {
            Alert.alert(
              'Close?',
              'Do you really want to close? Any unsaved progress will be lost!',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    if (
                      contentType === 'showAllPositions' ||
                      contentType === 'changeMap'
                    ) {
                      setTempPositions([])
                      setTempValues({ title: '', target: '' })
                      setContentType('menu')
                    } else {
                      setContentType('showAllPositions')
                    }
                    setHasChanges(false)
                  },
                  style: 'destructive',
                },
              ]
            )
          }
        } else {
          switch (contentType) {
            case 'addPosition':
            case 'editPosition':
              setContentType('showAllPositions')
              break
            case 'showAllPositions':
              setTempPositions([])
            case 'changeMap':
            default:
              setContentType('menu')
          }
          if (contentType === 'showAllPositions') {
            setTempPositions([])
            setContentType('menu')
          } else if (contentType === 'changeMap') {
            setContentType('menu')
          } else {
            setContentType('showAllPositions')
          }
        }
        break
    }
  }

  const _handleModalAction = (
    type: 'accept' | 'close',
    isDisabled?: boolean
  ) => {
    if (
      modalContentType === 'showAllPositions' ||
      modalContentType === 'changeMap'
    ) {
      setSearchTerm('')
    }

    switch (type) {
      case 'accept':
        if (isDisabled) {
          return
        }
        if (modalContentType === 'showAllPositions') {
          setMapPositions(tempPositions)
          setIsModalVisible(false)
          if (onChange) onChange({ ...map, positions: [...tempPositions] })
        } else {
          if (modalContentType === 'changeMap') {
            setIsModalVisible(false)
            if (onChange && tempMap) onChange(tempMap)
          } else {
            if (tempValues) {
              _addPosition({ ...tempValues, key: activeKey ?? '' }, activeKey)
            }
            setModalContentType('showAllPositions')
          }
        }
        setHasChanges(false)
        setTempValues({ title: '', target: '' })
        break
      case 'close':
      default:
        if (
          (modalContentType === 'showAllPositions' &&
            JSON.stringify(tempPositions) !== JSON.stringify(mapPositions)) ||
          hasChanges
        ) {
          if (IS_WEB) {
            const result = window.confirm(
              'Do you really want to close? Any unsaved progress will be lost!'
            )

            if (result) {
              if (
                modalContentType === 'showAllPositions' ||
                modalContentType === 'changeMap'
              ) {
                setTempPositions([])
                setTempValues({ title: '', target: '' })
                setIsModalVisible(false)
              } else {
                setModalContentType('showAllPositions')
              }
              setHasChanges(false)
            }
          } else {
            Alert.alert(
              'Close?',
              'Do you really want to close? Any unsaved progress will be lost!',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    if (
                      modalContentType === 'showAllPositions' ||
                      modalContentType === 'changeMap'
                    ) {
                      setTempPositions([])
                      setTempValues({ title: '', target: '' })
                      setIsModalVisible(false)
                    } else {
                      setModalContentType('showAllPositions')
                    }
                    setHasChanges(false)
                  },
                  style: 'destructive',
                },
              ]
            )
          }
        } else {
          switch (modalContentType) {
            case 'addPosition':
            case 'editPosition':
              setModalContentType('showAllPositions')
              break
            case 'showAllPositions':
              setTempPositions([])
            case 'changeMap':
            default:
              setIsModalVisible(false)
          }
          if (modalContentType === 'showAllPositions') {
            setTempPositions([])
            setIsModalVisible(false)
          } else if (modalContentType) {
            setModalContentType('showAllPositions')
          }
        }
        break
    }
  }

  const _renderModal = () => {
    const isDisabled =
      (modalContentType === 'addPosition' ||
        modalContentType === 'editPosition') &&
      (!tempValues.title ||
        !tempValues.target ||
        tempValues.title === '' ||
        tempValues.target === '')
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <View
          testID={`${testID ?? 'linkedmap'}_modal_backdrop`}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
          onTouchEnd={() => {
            setTempValues({ title: '', target: '' })
            setIsModalVisible(false)
          }}
        />
        <View
          style={{
            flex: 1,
            width: '100%',
            borderRadius: 5,
            shadowColor: 'grey',
            backgroundColor: 'white',
            padding: 20,
            marginVertical: 20,
          }}
        >
          <View
            testID={`${testID ?? 'linkedmap'}_modal_header`}
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              testID={`${testID ?? 'linkedmap'}_modal_accept`}
              style={{
                justifyContent: 'center',
                padding: 8,
                aspectRatio: 1,
                borderWidth: 1,
                borderRadius: 999,
                borderColor: isDisabled ? 'grey' : 'darkgreen',
              }}
              disabled={isDisabled}
              onPress={() => {
                _handleModalAction('accept', isDisabled)
              }}
            >
              <Image
                style={{
                  tintColor: isDisabled ? 'grey' : 'darkgreen',
                }}
                source={acceptIcon}
                height={16}
                width={16}
              />
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                textAlign: 'center',
              }}
              adjustsFontSizeToFit
              center
              numberOfLines={2}
            >
              {optionText}
            </Text>
            <TouchableOpacity
              testID={`${testID ?? 'linkedmap'}_modal_close`}
              style={{
                justifyContent: 'center',
                padding: 8,
                aspectRatio: 1,
                borderWidth: 1,
                borderRadius: 999,
                borderColor: 'darkred',
              }}
              onPress={() => {
                _handleModalAction('close', isDisabled)
              }}
            >
              <Image
                style={{ tintColor: 'darkred' }}
                source={closeIcon}
                height={16}
                width={16}
              />
            </TouchableOpacity>
          </View>
          {_renderModalContent()}
        </View>
      </View>
    )
  }

  const _renderMenu = () => {
    return (
      <ScrollView style={{ flexGrow: 0 }}>
        <TouchableOpacity
          onPress={() => {
            if (editMode) {
              setOptionText('Change map')
              setContentType('changeMap')
              setModalContentType('changeMap')
              return
            }
            bottomSheetRef.current?.close()
            setOptionText('Change map')
            setModalContentType('changeMap')
            setTimeout(() => {
              setIsModalVisible(true)
            }, 100)
          }}
          style={{ paddingVertical: 5 }}
        >
          <Text largerText>Change map</Text>
        </TouchableOpacity>
        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: 'grey',
            marginVertical: 5,
            opacity: 0.5,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            if (editMode) {
              setOptionText('Manage positions')
              setTempPositions([...mapPositions])
              setContentType('showAllPositions')
              return
            }
            bottomSheetRef.current?.close()
            setTempPositions([...mapPositions])
            setOptionText('Manage positions')
            setModalContentType('showAllPositions')
            setTimeout(() => {
              setIsModalVisible(true)
            }, 100)
          }}
          style={{ paddingVertical: 5 }}
        >
          <Text largerText>Manage Positions</Text>
        </TouchableOpacity>
        {!editMode && (
          <View>
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: 'grey',
                marginVertical: 5,
                opacity: 0.5,
              }}
            />

            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.close()
              }}
              style={{ paddingVertical: 5 }}
            >
              <Text largerText>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    )
  }

  const _renderContent = () => {
    if (editMode) {
      const isDisabled =
        (contentType === 'addPosition' || contentType === 'editPosition') &&
        (!tempValues.title ||
          !tempValues.target ||
          tempValues.title === '' ||
          tempValues.target === '')

      return (
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'white',
            padding: 20,
          }}
        >
          {contentType !== 'menu' && (
            <View
              testID={`${testID ?? 'linkedmap'}_editmode_header`}
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                testID={`${testID ?? 'linkedmap'}_editmode_accept`}
                style={{
                  justifyContent: 'center',
                  padding: 8,
                  aspectRatio: 1,
                  borderWidth: 1,
                  borderRadius: 999,
                  borderColor: isDisabled ? 'grey' : 'darkgreen',
                }}
                disabled={isDisabled}
                onPress={() => {
                  _handleEditAction('accept', isDisabled)
                }}
              >
                <Image
                  style={{
                    tintColor: isDisabled ? 'grey' : 'darkgreen',
                  }}
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/447/447147.png',
                  }}
                  height={16}
                  width={16}
                />
              </TouchableOpacity>
              <Text
                style={{
                  flex: 1,
                  fontSize: 20,
                  textAlign: 'center',
                }}
                adjustsFontSizeToFit
                center
                numberOfLines={2}
              >
                {optionText}
              </Text>
              <TouchableOpacity
                testID={`${testID ?? 'linkedmap'}_editmode_close`}
                style={{
                  justifyContent: 'center',
                  padding: 8,
                  aspectRatio: 1,
                  borderWidth: 1,
                  borderRadius: 999,
                  borderColor: 'darkred',
                }}
                onPress={() => {
                  _handleEditAction('close', isDisabled)
                }}
              >
                <Image
                  style={{ tintColor: 'darkred' }}
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828747.png',
                  }}
                  height={16}
                  width={16}
                />
              </TouchableOpacity>
            </View>
          )}
          {_renderEditMode()}
        </View>
      )
    }

    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        {title && (
          <Text
            style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: 'bold',
              ...titleStyle,
            }}
          >
            {title}
          </Text>
        )}
        {keyErrors.length === 0 ? (
          <Map
            testId={`${testID ?? 'linkedmap'}_map`}
            activePosition={activePosition}
            customAnimation={customAnimation}
            hidePositions={hidePositions}
            map={map}
            onClick={onClick ? (pos) => _handleOnClick(pos) : undefined}
            zoomable
            positionStyle={positionStyle}
            showZoomButtons={showZoomButtons}
            zoomButtonsStyle={zoomButtonsStyle}
          />
        ) : (
          <View
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              alignItems: 'center',
            }}
          >
            <Text
              center
              style={{
                marginBottom: 15,
              }}
              largerText
            >
              Found duplicates in position keys!
            </Text>
            {keyErrors.map((e) => {
              return (
                <Text center key={`keyerror_${e}`} style={{ marginBottom: 2 }}>
                  {e}
                </Text>
              )
            })}
          </View>
        )}
        {showMenu && keyErrors.length === 0 && (
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 5,
                paddingHorizontal: 10,
                backgroundColor: '#EEEEEE',
                borderRadius: 5,
                borderColor: 'black',
                borderWidth: 1,
              }}
              onPress={() => bottomSheetRef.current?.open()}
            >
              <Text largerText>Menu</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {_renderContent()}
      <Modal
        isVisible={isModalVisible}
        onModalHide={() => setIsModalVisible(false)}
        onDismiss={() => setIsModalVisible(false)}
        presentationStyle={'overFullScreen'}
        style={{ marginVertical: 20, marginHorizontal: 10, paddingTop: 10 }}
      >
        {_renderModal()}
      </Modal>
      <RBSheet
        ref={bottomSheetRef as React.LegacyRef<RBSheet>}
        closeOnDragDown
        dragFromTopOnly
        closeOnPressBack={true}
        animationType={'slide'}
        openDuration={100}
        closeDuration={100}
        customStyles={{
          container: {
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            paddingBottom: 50,
            height: 'auto',
            maxHeight: 200,
          },
        }}
        closeOnPressMask
      >
        <View style={{ paddingHorizontal: 20 }}>{_renderMenu()}</View>
      </RBSheet>
    </View>
  )
}

export default LinkedMap
