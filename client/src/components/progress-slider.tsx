import Image from 'next/image'
import SilderImg01 from '@/public/ps-image-01.png'
import SilderImg02 from '@/public/ps-image-02.png'
import SilderImg03 from '@/public/ps-image-03.png'
import SilderImg04 from '@/public/ps-image-04.png'
import SilderIcon01 from '@/public/ps-icon-01.svg'
import SilderIcon02 from '@/public/ps-icon-02.svg'
import SilderIcon03 from '@/public/ps-icon-03.svg'
import SilderIcon04 from '@/public/ps-icon-04.svg'

export default function ProgressSlider() {

  const items = [
    {
      img: SilderImg01,
      desc: 'Omnichannel',
      buttonIcon: SilderIcon01,
    },
    {
      img: SilderImg02,
      desc: 'Multilingual',
      buttonIcon: SilderIcon02,
    },
    {
      img: SilderImg03,
      desc: 'Interpolate',
      buttonIcon: SilderIcon03,
    },
    {
      img: SilderImg04,
      desc: 'Enriched',
      buttonIcon: SilderIcon04,
    },
  ]  

  return (
    <div className="w-full max-w-5xl mx-auto text-center">
      {/* Item image */}
      <div className="transition-all duration-150 delay-300 ease-in-out">
        <div className="relative flex flex-col">

          {items.map((item, index) => (
            <Image className="rounded-xl" src={item.img} width={1024} height={576} alt={item.desc} />
          ))}

        </div>
      </div>
      {/* Buttons */}
      <div className="max-w-xs sm:max-w-sm md:max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

        {items.map((item, index) => (
          <button
            key={index}
            className="p-2 rounded focus:outline-none focus-visible:ring focus-visible:ring-indigo-300 group"
          >
            <span className="text-center flex flex-col items-center">
              <span className="flex items-center justify-center relative w-9 h-9 rounded-full bg-indigo-100 mb-2">
                <Image src={item.buttonIcon} alt={item.desc} />
              </span>
              <span className="block text-sm font-medium text-slate-900 mb-2">{item.desc}</span>
              <span className="block relative w-full bg-slate-200 h-1 rounded-full" role="progressbar" aria-valuenow={0}>
                <span className="absolute inset-0 bg-indigo-500 rounded-[inherit]" style={{ width: '0%' }}></span>
              </span>
            </span>
          </button>
        ))}

      </div>
    </div>
  )
}