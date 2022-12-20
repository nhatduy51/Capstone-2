import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../store/actions'
import moment from 'moment'
import { Button, UpdatePost } from '../../components'
import {apiDeletePost} from '../../services'
import Swal from 'sweetalert2'



const ManagePost = () => {

  const dispach = useDispatch()
  const [isEdit, setIsEdit] = useState(false)
  const { postOfCurrent, dataEdit } = useSelector(state => state.post)
  const [updateData, setUpdateData] = useState(false)
  // console.log(postOfCurrent)
  useEffect(() => {
    !dataEdit && dispach(actions.getPostsLimitAdmin())
  }, [dataEdit, updateData])

  useEffect(() => {
    !dataEdit && setIsEdit(false)
  }, [dataEdit])

  const checkStatus = (dateString) => moment(dateString, process.env.REACT_APP_FORMAT_DATE).isSameOrAfter(new Date().toDateString())

  const handleDeletePost = async (postId) => {

    const response = await apiDeletePost(postId)
    if (response?.data.err === 0) {
      setUpdateData(prev => !prev)
    } else {
      Swal.fire('Ops!', 'Xoá tin thất bại', 'error')
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='py-4 border-b border-gray-200 flex items-center justify-between'>
        <h1 className='text-3xl font-medium '>Quản lí tin đăng</h1>
        <select className=' outline-none border p-2 border-gray-200 rounded-md'>
          <option value=''>Lọc theo trạng thái</option>
        </select>
      </div>
      <table className='w-full table-auto'>
        <thead>
          <tr className='flex w-full bg-gray-200'>
            <th className='border flex-1 p-2'>Mã tin</th>
            <th className='border flex-1 p-2'>Ảnh đại diện</th>
            <th className='border flex-1 p-2'>Tiêu đề</th>
            <th className='border flex-1 p-2'>Giá</th>
            <th className='border flex-1 p-2'>Ngày bắt đầu</th>
            <th className='border flex-1 p-2'>Ngày hết hạn</th>
            <th className='border flex-1 p-2'>Trạng thái</th>
            <th className='border flex-1 p-2'>Tuỳ chọn</th>
          </tr>
        </thead>
        <tbody>
          {!postOfCurrent
            ? <tr>
              <td>tranviethung</td>
            </tr>
            : postOfCurrent?.map(item => {
              return (
                <tr className='flex items-center h-16' key={item.id}>
                  <td className='border px-2 flex-1 h-full flex justify-center items-center '>{item?.overviews?.code}</td>
                  <td className='border px-2 flex-1 h-full flex justify-center items-center'>
                    <img src={JSON.parse(item?.images?.image)[0] || ''} alt='avatar-post' className='w-10 h-10 object-cover rounded-md'></img>
                  </td>
                  <td className='border px-2 flex-1 h-full flex justify-center items-center'>{`${item?.title?.slice(0, 40)}...`}</td>
                  <td className='border px-2 flex-1 h-full flex justify-center items-center'>{item?.attributes?.price}</td>
                  <td className='border px-2 flex-1 h-full flex justify-center items-center'>{item?.overviews?.created}</td>
                  <td className='border px-2 flex-1 h-full flex justify-center items-center'>{item?.overviews?.expired}</td>
                  <td className='border px-2 flex-1 h-full flex justify-center items-center'>{checkStatus(item?.overviews?.expired?.split('')[3]) ? 'Đã hết hạn' : 'Đang hoạt động'}</td>
                  <td className='border px-2 flex-1 h-full flex justify-center items-center gap-4'>
                    <Button text='Sửa' bgColor='bg-green-600' textColor='text-white' onClick={() => {
                      dispach(actions.editData(item))
                      setIsEdit(true)
                    }} />
                    <Button text='Xoá' bgColor='bg-red-600' textColor='text-white' onClick={() => handleDeletePost(item.id)} />
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      {isEdit && <UpdatePost setIsEdit={setIsEdit} />}
    </div>
  )
}

export default ManagePost