import React, {memo} from 'react'
import anonAvatar from '../assets/anon-avatar.png'
import icons from '../ultils/icons'
import { Button } from './'

const { BsDot, BsTelephonePlusFill, SiZalo } = icons

const BoxInfo = ({user}) => {
  return (
    <div className='w-full bg-yellow-500 rounded-md flex flex-col items-center p-4'>
      <img className='w-16 h-16 object-contain rounded-full' src={anonAvatar} alt="avatar"/>
      <h3>{user?.name}</h3>
      <div className='flex items-center'>
          <BsDot color='green' size={30} />
          <span>Đang hoạt động</span>
      </div>
      <Button 
        text={user?.phone} 
        bgColor='bg-cyan-600' 
        fullWidth 
        textColor="text-white font-bold text-xl" 
        IcBefore={BsTelephonePlusFill}
      />
      <a className='bg-white py-2 flex item-center justify-center gap 2 w-full rounded-md font-bold text-lg my-2'
        // href={`https://zalo.me/${user.zalo}`}
      >
        <SiZalo color="blue" size={35} />
      </a>
    </div>
  )
}
export default memo(BoxInfo)
