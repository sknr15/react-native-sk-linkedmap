import React, { useEffect, useState, useRef } from 'react'
import {
  Alert,
  ScrollView,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import Modal from 'react-native-modal'
import { AddPosition, EditPosition } from './Position'
import { Text } from './Form'
import RBSheet from 'react-native-raw-bottom-sheet'
import Image from 'react-native-scalable-image'
import { TCoordinates, TMap, TPosition } from './interfaces'
import { Map, MapPicker } from './Map'

type TModalContentType =
  | 'addPosition'
  | 'editPosition'
  | 'showAllPositions'
  | 'changeMap'

export type { TCoordinates, TMap, TPosition }

export const LinkedMap = ({
  map,
  onChange,
  onClick,
  positionStyle,
  showMenu,
  showZoomButtons,
  style,
  testID,
  title,
  zoomButtonsStyle,
}: {
  map: TMap
  onChange?: (map: TMap) => void
  onClick?: (position?: TPosition) => void
  positionStyle?: ViewStyle
  showMenu?: boolean
  showZoomButtons?: boolean
  style?: ViewStyle
  testID?: string
  title?: string
  zoomButtonsStyle?: ViewStyle & TextStyle
}) => {
  const [optionText, setOptionText] = useState<string>('')

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const [modalContentType, setModalContentType] =
    useState<TModalContentType>('showAllPositions')

  const [mapPositions, setMapPositions] = useState<TPosition[]>([])

  const [tempPositions, setTempPositions] = useState<typeof mapPositions>([])
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
    switch (modalContentType) {
      case 'addPosition':
        return (
          <AddPosition
            testId={`${testID}_add_mapposition`}
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
              testId={`${testID}_edit_mapposition`}
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
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10,
                backgroundColor: '#448AFF',
                borderRadius: 5,
              }}
              onPress={() => {
                setActiveKey(undefined)
                setTempValues({ title: '', target: '' })
                setModalContentType('addPosition')
              }}
            >
              <Text style={{ fontSize: 18, color: 'white' }}>Add position</Text>
            </TouchableOpacity>
            <ScrollView style={{ marginTop: 10 }}>
              {tempPositions
                ?.sort((a, b) => {
                  if (a.title === b.title) return a.key.localeCompare(b.key)
                  return a.title.localeCompare(b.title)
                })
                .map((position, index) => {
                  const isLastItem = index === tempPositions.length - 1
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
                        testID={`mapposition_${position.key}_detail`}
                        onPress={() => {
                          setActiveKey(position.key)
                          setTempValues({
                            title: position.title,
                            target: position.target,
                          })
                          setModalContentType('editPosition')
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
                        testID={`mapposition_${position.key}_delete`}
                        onPress={() => {
                          let _mapPos = tempPositions?.filter(
                            (e) => e.key !== position.key
                          )
                          setTempPositions(_mapPos)
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
            </ScrollView>
          </View>
        )
    }
  }

  const _renderMapPicker = () => {
    return (
      <MapPicker
        testId='mappicker'
        map={map}
        onChange={(map) => {
          setTempMap({ ...map })
          setHasChanges(true)
        }}
      />
    )
  }

  const _renderModalContent = () => {
    switch (optionText) {
      case 'Change map':
        return _renderMapPicker()
      case 'Manage positions':
      default:
        return _renderManagePositions()
    }
  }

  const _handleModalAction = (
    type: 'accept' | 'close',
    isDisabled?: boolean
  ) => {
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
          testID='modal_backdrop'
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
            width: '100%',
            flex: 1,
            borderRadius: 5,
            shadowColor: 'grey',
            backgroundColor: 'white',
            padding: 20,
            marginVertical: 20,
          }}
        >
          <View
            testID='modal_header_buttons'
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              testID='modal_button_accept'
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
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/447/447147.png',
                }}
                width={16}
                height={16}
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
              testID='modal_button_close'
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
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828747.png',
                }}
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
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity
          onPress={() => {
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
      </ScrollView>
    )
  }

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        {showMenu && keyErrors.length === 0 && (
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
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
        {title && (
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
            {title}
          </Text>
        )}
        {keyErrors.length === 0 ? (
          <Map
            testId='linkedmap'
            map={map}
            onClick={_handleOnClick}
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
      </View>
      <Modal
        isVisible={isModalVisible}
        onModalHide={() => setIsModalVisible(false)}
        onDismiss={() => setIsModalVisible(false)}
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
        {_renderMenu()}
      </RBSheet>
    </View>
  )
}

export default LinkedMap
