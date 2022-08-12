import * as React from 'react'
import { Button, Image, ImageSourcePropType, Text, View } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu'
import * as ImagePicker from 'expo-image-picker'
import * as ImagePicker1 from 'react-native-image-picker'

export default function LinkedMap({
  source,
  image,
  title,
  showMenu,
}: {
  source?: string
  image?: ImageSourcePropType
  title?: string
  showMenu?: boolean
}) {
  const [containerSize, setContainerSize] = React.useState<{
    height: number
    width: number
  }>({ height: 0, width: 0 })

  const [imageSource, setImageSource] = React.useState<
    ImageSourcePropType | undefined
  >(undefined)
  const [optionText, setOptionText] = React.useState<string>('')

  const [isMapPickerVisible, setIsMapPickerVisible] =
    React.useState<boolean>(false)

  const [hasPermissions, setHasPermissions] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (image) {
      setImageSource(image)
    }
  }, [image])

  React.useEffect(() => {
    _requestPermission()
  }, [])

  const _requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    setHasPermissions(status === ImagePicker.PermissionStatus.GRANTED)
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
              onSelect={() => setOptionText('Manage positions')}
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
        {/* <View
        style={{
          minHeight: '25%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>You pressed {count} times!!</Text>
        <Button onPress={() => setCount(addOne(count))} title='Press Me' />
      </View> */}
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
          <Text>{optionText}</Text>
          {title && (
            <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
              {title}
            </Text>
          )}
          {image || source ? (
            <ImageZoom
              cropHeight={containerSize.height}
              cropWidth={containerSize.width}
              imageHeight={containerSize.height}
              imageWidth={containerSize.width}
            >
              <Image
                source={
                  imageSource ?? {
                    uri: source,
                  }
                }
                style={{
                  height: containerSize.height,
                  width: containerSize.width,
                }}
                resizeMode={'contain'}
                resizeMethod={'resize'}
              />
            </ImageZoom>
          ) : (
            <View>
              <Text>No image selected</Text>
            </View>
          )}
        </View>
      </View>
    </MenuProvider>
  )
}
