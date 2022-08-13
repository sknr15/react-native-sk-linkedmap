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
} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu'
import * as ImagePicker from 'expo-image-picker'
import Modal from 'react-native-modal'

type TModalContentType =
  | 'addPosition'
  | 'showAllPositions'
  | 'showPositionDetail'

export default function LinkedMap({
  source,
  image,
  title,
  showMenu,
  style,
}: {
  source?: string
  image?: ImageSourcePropType
  title?: string
  showMenu?: boolean
  style?: ViewStyle
}) {
  const [containerSize, setContainerSize] = React.useState<{
    height: number
    width: number
  }>({ height: 0, width: 0 })
  const [modalSize, setModalSize] = React.useState<{
    height: number
    width: number
  }>({ height: 0, width: 0 })

  const [imageSource, setImageSource] = React.useState<
    ImageSourcePropType | undefined
  >(undefined)
  const [optionText, setOptionText] = React.useState<string>('')

  const [isMapPickerVisible, setIsMapPickerVisible] =
    React.useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)

  const [hasPermissions, setHasPermissions] = React.useState<boolean>(false)

  const [modalContentType, setModalContentType] =
    React.useState<TModalContentType>('showAllPositions')

  const [mapPositions, setMapPositions] = React.useState<
    { key: string; title: string }[]
  >([])

  const [tempPositions, setTempPositions] = React.useState<typeof mapPositions>(
    []
  )
  const [tempName, setTempName] = React.useState<string>('')
  const [activeKey, setActiveKey] = React.useState<string | undefined>(
    undefined
  )

  React.useEffect(() => {
    if (image) {
      setImageSource(image)
    }
  }, [image])

  React.useEffect(() => {
    _requestPermission()
  }, [])

  const _requestPermission = async () => {
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    // setHasPermissions(status === ImagePicker.PermissionStatus.GRANTED)
  }

  const _pickImage = async () => {
    if (hasPermissions) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.66,
      })

      if (!result.cancelled) {
        setImageSource(result)
      }
    }
  }

  const _addPosition = (title: string, key?: string) => {
    let _mapPos: typeof tempPositions = [...tempPositions]
    if (key) {
      let _tempPos = _mapPos?.find((e) => e.key === key)

      if (_tempPos) {
        _tempPos.title = title
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

  const _renderImage = (height: number, width: number) => {
    if (image || imageSource) {
      return (
        <ImageZoom
          cropHeight={height}
          cropWidth={width}
          imageHeight={height}
          imageWidth={width}
        >
          <Image
            source={
              imageSource ?? {
                uri: source,
              }
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

    return (
      <View>
        <Text>No image selected</Text>
      </View>
    )
  }

  const _renderModalContent = (position?: string) => {
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
                onChangeText={(val) => setTempName(val)}
              />
            </View>
            <View style={{ flex: 1 }}>
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
                  {_renderImage(modalSize.height, modalSize.width)}
                </View>
              </View>
            </View>
          </View>
        )
      case 'showPositionDetail':
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
                onChangeText={(val) => setTempName(val)}
              />
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
                setModalContentType('addPosition')
              }}
            >
              <Text style={{ fontSize: 18, color: 'white' }}>Add position</Text>
            </TouchableOpacity>
            <ScrollView style={{ marginTop: 10 }}>
              {tempPositions?.map((position, index) => {
                return (
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderBottomWidth:
                        index === tempPositions.length - 1 ? 0 : 1,
                      paddingVertical: 5,
                    }}
                    key={`mapposition_${position.key}`}
                  >
                    <TouchableOpacity
                      testID={`mapposition_${position.key}_detail`}
                      onPress={() => {
                        setActiveKey(position.key)
                        setTempName(position.title)
                        setModalContentType('showPositionDetail')
                      }}
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        paddingLeft: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{position.title}</Text>
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
                      <Text style={{ color: 'red', fontSize: 16 }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        )
    }
  }

  const _renderModal = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          testID='modal_backdrop'
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          onTouchEnd={() => {
            setModalContentType('showAllPositions')
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
                } else {
                  if (tempName) {
                    _addPosition(tempName, activeKey)
                  }
                  setModalContentType('showAllPositions')
                }
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
                if (modalContentType === 'showAllPositions') {
                  if (
                    JSON.stringify(tempPositions) !==
                    JSON.stringify(mapPositions)
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
                            setTempPositions([])
                            setIsModalVisible(false)
                          },
                          style: 'destructive',
                        },
                      ]
                    )
                  } else {
                    setTempPositions([])
                    setIsModalVisible(false)
                  }
                } else {
                  setModalContentType('showAllPositions')
                }
                setTempName('')
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
                _pickImage()
              }}
              text='Change map'
              style={{ borderBottomWidth: 1 }}
            />
            <MenuOption
              onSelect={() => {
                setTempPositions(mapPositions)
                setOptionText('Manage positions')
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
