import * as React from 'react'
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import Modal from 'react-native-modal'
import * as ImagePicker from 'expo-image-picker'
import ReactCrop from 'react-image-crop'
import { MapPicker, TMap } from './Map'
import {
  AddPosition,
  EditPosition,
  PositionPicker,
  TCoordinates,
  TPosition,
} from './Position'
import { Text } from './Form'
import RBSheet from 'react-native-raw-bottom-sheet'

type TModalContentType =
  | 'addPosition'
  | 'editPosition'
  | 'showAllPositions'
  | 'changeMap'

export default function LinkedMap({
  testID,
  title,
  image,
  style,
  map,
  positions,
  showMenu,
  onChange,
  onClick,
}: {
  testID: string
  title?: string
  image?: ImageSourcePropType
  style?: ViewStyle
  map: TMap
  positions?: TPosition[]
  showMenu?: boolean
  onClick?: (position?: TPosition) => void
  onChange?: (map: TMap) => void
}) {
  const [containerSize, setContainerSize] = React.useState<{
    height: number
    width: number
  }>({ height: 0, width: 0 })
  const [modalSize, setModalSize] = React.useState<{
    height: number
    width: number
  }>({ height: 0, width: 0 })

  const [imageSource, setImageSource] = React.useState<ImageSourcePropType>(0)
  const [optionText, setOptionText] = React.useState<string>('')

  const [isMapPickerVisible, setIsMapPickerVisible] =
    React.useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)

  const [hasPermissions, setHasPermissions] = React.useState<boolean>(false)

  const [modalContentType, setModalContentType] =
    React.useState<TModalContentType>('showAllPositions')

  const [mapPositions, setMapPositions] = React.useState<TPosition[]>([])

  const [tempPositions, setTempPositions] = React.useState<typeof mapPositions>(
    []
  )
  const [tempMap, setTempMap] = React.useState<typeof map | undefined>(
    undefined
  )

  const [tempValues, setTempValues] = React.useState<{
    title: string
    target: string
    coordinates?: TCoordinates
  }>({ title: '', target: '', coordinates: undefined })
  const [activeKey, setActiveKey] = React.useState<string | undefined>(
    undefined
  )
  const [hasChanges, setHasChanges] = React.useState<boolean>(false)

  const bottomSheetRef = React.useRef<RBSheet | undefined>(undefined)

  React.useEffect(() => {
    if (image) {
      setImageSource(image)
    }
  }, [image, map])

  React.useEffect(() => {
    if (map.positions) {
      setMapPositions(
        map.positions.sort((a, b) => {
          if (a.title === b.title) return a.key.localeCompare(b.key)
          return a.title.localeCompare(b.title)
        })
      )
    }
  }, [positions])

  React.useEffect(() => {
    if (map) {
      setTempMap(map)
    }
  }, [map])

  React.useEffect(() => {
    _requestPermission()
  }, [])

  const _requestPermission = async () => {
    ImagePicker.useMediaLibraryPermissions({})
    setHasPermissions(ImagePicker.PermissionStatus.GRANTED === 'granted')
  }

  const _handleOnClick = () => {
    const _activePosition =
      mapPositions.find((e) => e.key === activeKey) ?? mapPositions[0]
    if (_activePosition) {
      if (onClick) {
        onClick(_activePosition)
      }
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

  const _renderImage = (height: number, width: number, editMode?: boolean) => {
    if (map && map.imageSource) {
      return (
        <ImageZoom
          cropHeight={height}
          cropWidth={width}
          imageHeight={height}
          imageWidth={width}
          onClick={_handleOnClick}
        >
          <Image
            source={
              typeof map.imageSource === 'string'
                ? { uri: map.imageSource }
                : map.imageSource
            }
            style={{
              height,
              width,
            }}
            resizeMode={'contain'}
            resizeMethod={'resize'}
          />
        </ImageZoom>
      )
    }

    if (image || imageSource) {
      return (
        <ImageZoom
          cropHeight={height}
          cropWidth={width}
          imageHeight={height}
          imageWidth={width}
          onClick={_handleOnClick}
        >
          <Image
            source={imageSource}
            style={{
              height,
              width,
            }}
            resizeMode={'contain'}
            resizeMethod={'resize'}
          />
        </ImageZoom>
      )
    }

    return (
      <View>
        <Text>No image selected</Text>
      </View>
    )
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
          console.log(tempPositions)
          if (onChange) onChange({ ...map, positions: [...tempPositions] })
        } else {
          if (modalContentType === 'changeMap') {
            setIsModalVisible(false)
            if (onChange && tempMap) onChange(tempMap)
          } else {
            if (tempValues) {
              _addPosition({ ...tempValues }, activeKey)
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
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          testID='modal_backdrop'
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
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
                style={{ tintColor: isDisabled ? 'grey' : 'darkgreen' }}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/447/447147.png',
                  height: 16,
                  width: 16,
                }}
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
                  height: 16,
                  width: 16,
                }}
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
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        onLayout={(e) =>
          setContainerSize({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
          })
        }
      >
        {showMenu && (
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 10,
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <TouchableOpacity
              style={{
                zIndex: 1,
                paddingVertical: 5,
                paddingHorizontal: 10,
                backgroundColor: '#EEEEEE66',
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
        {_renderImage(containerSize.height, containerSize.width)}
      </View>
      <Modal
        isVisible={isModalVisible}
        onModalHide={() => setIsModalVisible(false)}
        onDismiss={() => setIsModalVisible(false)}
      >
        {_renderModal()}
      </Modal>
      <RBSheet
        ref={bottomSheetRef}
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
