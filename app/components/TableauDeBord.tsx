import React from 'react'
interface Props{
    title : string,
    isLoading : string,
    textColor : string,
    borderColor : string,
    values : string,
}
export default function TableauDeBord({title,isLoading,textColor,borderColor,values}:Props) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${borderColor}`}>
        <h1 className="text-lg font-semibold text-gray-7000">
             {title}
        </h1>
        {
            isLoading ? (
                <p className={`text-2xl font-bold ${textColor}`}>Chargement</p>
            ) :
            (
                <p className={`text-2xl font-bold ${textColor}`}>{values}</p>
            )
        }
    </div>
  )
}
