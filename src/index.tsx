import * as React from 'react'
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  ImageBackground,
} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu'
import Modal from 'react-native-modal'
import * as ImagePicker from 'expo-image-picker'
import ReactCrop from 'react-image-crop'
import { MapPicker } from './Map/MapPicker'

type TModalContentType =
  | 'addPosition'
  | 'editPosition'
  | 'showAllPositions'
  | 'changeMap'

export type TPosition = { key: string; title: string } // needs coordinates etc.

export type TMap = { key: string; title: string; src?: ImageSourcePropType } // what does a map need?

export default function LinkedMap({
  image,
  title,
  showMenu,
  style,
  map,
  positions,
  onChangePositions,
  onChangeMap,
}: {
  map: TMap
  image?: ImageSourcePropType
  title?: string
  showMenu?: boolean
  style?: ViewStyle
  positions?: TPosition[]
  onChangePositions?: (pos: TPosition[]) => void
  onChangeMap?: (map: TMap) => void
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

  const [tempName, setTempName] = React.useState<string>('')
  const [activeKey, setActiveKey] = React.useState<string | undefined>(
    undefined
  )
  const [hasChanges, setHasChanges] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (image) {
      setImageSource(image)
    }
  }, [image, map])

  React.useEffect(() => {
    if (positions) {
      setMapPositions(
        positions.sort((a, b) => {
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
    //ImagePicker.useMediaLibraryPermissions({})
    //setHasPermissions(ImagePicker.PermissionStatus.GRANTED === 'granted')
  }

  const _addPosition = (title: string, key?: string) => {
    let _mapPos: typeof tempPositions = [...tempPositions]
    if (key) {
      if (_mapPos.find((pos) => pos.key === key)) {
        _mapPos = _mapPos.map((obj) => {
          if (obj.key === key) {
            return { ...obj, title: title }
          }

          return obj
        })
      } else {
        _mapPos?.push({ key, title })
      }
    } else {
      let _key = title.replaceAll(' ', '').toLowerCase()
      let i = 0
      while (true) {
        if (_mapPos?.find((e) => e.key === _key)) {
          _key = title.replaceAll(' ', '').toLowerCase() + '_' + i++
        } else {
          _mapPos?.push({ key: _key, title })
          break
        }
      }
    }
    setTempPositions(_mapPos)
  }

  const _renderImage = (height: number, width: number, editMode?: boolean) => {
    if (map && map.src) {
      return (
        <ImageZoom
          cropHeight={height}
          cropWidth={width}
          imageHeight={height}
          imageWidth={width}
        >
          <Image
            source={typeof map.src === 'string' ? { uri: map.src } : map.src}
            style={{
              height,
              width,
            }}
            resizeMode={'contain'}
            resizeMethod={'resize'}
          />
        </ImageZoom>
      )
    } else if (image || imageSource) {
      return (
        <ImageZoom
          cropHeight={height}
          cropWidth={width}
          imageHeight={height}
          imageWidth={width}
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

  const _renderAspectRatioButtons = () => {
    return <View style={{ flexDirection: 'row' }}></View>
  }

  const _renderPositionPicker = (height: number, width: number) => {
    // if iOS or Android
    return (
      <ImageBackground
        source={map.src ?? imageSource}
        resizeMode='contain'
        style={{ width: width, height: height }}
      >
        {/* Cropper */}
      </ImageBackground>
    )

    // if WEB
    return (
      <ReactCrop onChange={() => {}}>
        {_renderImage(height, width, true)}
      </ReactCrop>
    )
  }

  const _renderManagePositions = () => {
    switch (modalContentType) {
      case 'addPosition':
        return (
          <View style={{ flex: 1 }}>
            <View
              testID='modal_add_mapposition_input'
              style={{
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text>Title: </Text>
              <TextInput
                placeholder='Title'
                style={{
                  flex: 1,
                  marginLeft: 5,
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                  borderRadius: 2,
                  borderWidth: 1,
                }}
                value={tempName}
                onChangeText={(val) => {
                  setTempName(val)
                  setHasChanges(true)
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              {_renderAspectRatioButtons()}
              <View
                testID='modal_add_mapposition_map'
                style={{
                  height: '100%',
                  width: '100%',
                  borderColor: 'black',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onLayout={(e) =>
                  setModalSize({
                    height: e.nativeEvent.layout.height - 2,
                    width: e.nativeEvent.layout.width - 2,
                  })
                }
              >
                <View style={{ flex: 1 }}>
                  {/* {_renderImage(modalSize.height, modalSize.width, true)} */}
                  {_renderPositionPicker(modalSize.height, modalSize.width)}
                </View>
              </View>
            </View>
          </View>
        )
      case 'editPosition':
        return (
          <View style={{ flex: 1 }}>
            <View
              testID='modal_change_mapposition_input'
              style={{
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text>Title: </Text>
              <TextInput
                placeholder='Title'
                style={{
                  flex: 1,
                  marginLeft: 5,
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                  borderRadius: 2,
                  borderWidth: 1,
                }}
                value={tempName}
                onChangeText={(val) => {
                  setTempName(val)
                  setHasChanges(true)
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              {_renderAspectRatioButtons()}
              <View
                testID='modal_edit_mapposition_map'
                style={{
                  height: '100%',
                  width: '100%',
                  borderColor: 'black',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onLayout={(e) =>
                  setModalSize({
                    height: e.nativeEvent.layout.height - 2,
                    width: e.nativeEvent.layout.width - 2,
                  })
                }
              >
                <View style={{ flex: 1 }}>
                  {_renderImage(modalSize.height, modalSize.width)}
                </View>
              </View>
            </View>
          </View>
        )
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
                setTempName('')
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
                          setTempName(position.title)
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
                          <Text style={{ fontSize: 16, paddingRight: 5 }}>
                            {position.title}
                          </Text>
                          <Text
                            style={{ fontSize: 14, opacity: 0.7 }}
                          >{`(${position.key})`}</Text>
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
        positions={tempPositions}
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

  const _renderModal = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          testID='modal_backdrop'
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          onTouchEnd={() => {
            setTempName('')
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
            marginVertical: 40,
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
              style={{
                justifyContent: 'center',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
              onPress={() => {
                if (modalContentType === 'showAllPositions') {
                  setMapPositions(tempPositions)
                  setIsModalVisible(false)
                  if (onChangePositions) onChangePositions(tempPositions)
                } else {
                  if (modalContentType === 'changeMap') {
                    setIsModalVisible(false)
                    if (onChangeMap && tempMap) onChangeMap(tempMap)
                  } else {
                    if (tempName) {
                      _addPosition(tempName, activeKey)
                    }
                    setModalContentType('showAllPositions')
                  }
                }
                setHasChanges(false)
                setTempName('')
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: '#2962FF',
                  fontWeight: 'bold',
                }}
              >
                Accept
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                fontSize: 22,
                textAlign: 'center',
              }}
              adjustsFontSizeToFit
              numberOfLines={2}
            >
              {optionText}
            </Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
              onPress={() => {
                if (
                  (modalContentType === 'showAllPositions' &&
                    JSON.stringify(tempPositions) !==
                      JSON.stringify(mapPositions)) ||
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
                            setTempName('')
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
              }}
            >
              <Text
                style={{ fontSize: 18, color: '#2962FF', fontWeight: 'bold' }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
          {_renderModalContent()}
        </View>
      </View>
    )
  }

  const _renderMenu = () => {
    if (showMenu) {
      return (
        <Menu
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 1,
          }}
          onBackdropPress={() => setOptionText('')}
        >
          <MenuTrigger
            text='Menu'
            style={{
              height: 30,
              width: 50,
              borderWidth: 1,
              borderRadius: 5,
              margin: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
            }}
          />
          <MenuOptions
            optionsContainerStyle={{
              marginTop: 45,
              marginLeft: -10,
              width: 'auto',
              borderRadius: 5,
            }}
            customStyles={{
              optionWrapper: { padding: 5 },
            }}
          >
            <MenuOption
              onSelect={() => {
                setOptionText('Change map')
                setModalContentType('changeMap')
                setIsModalVisible(true)
              }}
              text='Change map'
              style={{ borderBottomWidth: 1 }}
            />
            <MenuOption
              onSelect={() => {
                setTempPositions([...mapPositions])
                setOptionText('Manage positions')
                setModalContentType('showAllPositions')
                setIsModalVisible(true)
              }}
              text='Manage positions'
            />
          </MenuOptions>
        </Menu>
      )
    }

    return null
  }

  return (
    <MenuProvider>
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
          {_renderMenu()}
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
        >
          {_renderModal()}
        </Modal>
      </View>
    </MenuProvider>
  )
}
