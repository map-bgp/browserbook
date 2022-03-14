import { InformationCircleIcon } from '@heroicons/react/solid'

type InfoProps = {
  message: string
}

const Info = (props: InfoProps) => {
  return (
    <div>
      <div className="mt-4 inline-flex rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700">{props.message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Info
