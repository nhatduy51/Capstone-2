import React, { useState } from 'react'
import { Overview, Address, Loading, Button } from '../../components'
import { apiUploadImages } from '../../services'
import icons from '../../ultils/icons'
import { getCodes, getCodesArea } from '../../ultils/Common/getCodes'
import { useSelector } from 'react-redux'
import { apiCreatePost } from '../../services'
import Swal from 'sweetalert2'

const { BsCameraFill, ImBin } = icons

const CreatePost = () => {

  const [payload, setPayload] = useState({
    categoryCode: '',
    title: '',
    priceNumber: 0,
    areaNumber: 0,
    images: '',
    address: '',
    priceCode: '',
    areaCode: '',
    description: '',
    target: '',
    province: ''
  })
  const [imagesPreview, setImagesPreview] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { prices, areas, categories, provinces } = useSelector(state => state.app)
  const {currentData} = useSelector(state => state.user)

  const handleFiles = async (e) => {
    e.stopPropagation()
    setIsLoading(true)
    let images = []
    let files = e.target.files
    let formData = new FormData()
    for (let i of files) {
      formData.append('file', i)
      formData.append('upload_preset', process.env.REACT_APP_UPLOAD_ASSETS_NAME)
      let response = await apiUploadImages(formData)
      if (response.status === 200) images = [...images, response.data?.secure_url]
    }
    setIsLoading(false)
    setImagesPreview(prev => [...prev, ...images])
    setPayload(prev => ({ ...prev, images: [...prev.images, ...images] }))
  }
  const handleDeleteImage = (image) => {
    setImagesPreview(prev => prev?.filter(item => item !== image))
    setPayload(prev => ({
      ...prev,
      images: prev.images?.filter(item => item !== image)
    }))
  }
  const handleSubmit = async () => {
    let priceCodeArr = getCodes(+payload.priceNumber / Math.pow(10, 6), prices, 1, 15)
    let priceCode = priceCodeArr[priceCodeArr.length - 1]?.code
    let areaCodeArr = getCodesArea(+payload.areaNumber, areas, 0, 90)
    let areaCode = areaCodeArr[0]?.code

    let finalPayload = {
      ...payload,
      priceCode,
      areaCode,
      userId: currentData.id,
      priceNumber: +payload.priceNumber / Math.pow(10, 6),
      target: payload.target || 't???t c???',
      label: `${categories?.find(item => item.code === payload.categoryCode)?.value} ${payload?.address?.split(',')[0]}`
    }

    const response = await apiCreatePost(finalPayload);
    console.log(response)
    if(response?.data.err === 0) {
      Swal.fire('Th??nh C??ng', '???? th??m b??i ????ng m???i', 'success')
        .then(() => {
          setPayload({
            categoryCode: '',
            title: '',
            priceNumber: 0,
            areaNumber: 0,
            images: '',
            address: '',
            priceCode: '',
            areaCode: '',
            description: '',
            target: '',
            province: ''
          })
        })
    } else {
      Swal.fire('Oops!', 'c?? l???i', 'error')
    }
  }

  return (
    <div className='px-6'>
      <h1 className='text-3xl font-medium py-4 border-b border-gray-200'>????ng tin m???i</h1>
      <div className='flex gap-4'>
        <div className='py-4 flex flex-col gap-8 flex-auto'>
          <Address payload={payload} setPayload={setPayload} />
          <Overview payload={payload} setPayload={setPayload} />
          <div className='w-full mb-6'>
            <h2 className='font-semibold text-xl py-4'>H??nh ???nh</h2>
            <small>C???p nh???t h??nh ???nh r?? r??ng s??? cho thu?? nhanh h??n</small>
            <div className='w-full'>
              <label className='w-full border-2 h-[200px] my-4 gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md' htmlFor="file">
                {isLoading
                  ? <Loading />
                  : <div className='flex flex-col items-center justify-center'>
                    <BsCameraFill color='blue' size={50} />
                    Th??m ???nh
                  </div>}
              </label>
              <input onChange={handleFiles} hidden type="file" id='file' multiple />
              <div className='w-full'>
                <h3 className='font-medium py-4'>???nh ???? ch???n</h3>
                <div className='flex gap-4 items-center'>
                  {imagesPreview?.map(item => {
                    return (
                      <div key={item} className='relative w-1/3 h-1/3 '>
                        <img src={item} alt="preview" className='w-full h-full object-cover rounded-md' />
                        <span
                          title='X??a'
                          onClick={() => handleDeleteImage(item)}
                          className='absolute top-0 right-0 p-2 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-full'
                        >
                          <ImBin />
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <Button onClick={handleSubmit} text='T???o m???i' bgColor='bg-green-600' textColor='text-white' />
          <div className='h-[500px]'>

          </div>
        </div>
        <div className='w-[30%] flex-none'>
          maps
          <Loading />
        </div>
      </div>
    </div>
  )
}

export default CreatePost