import React from "react";
import {ExclamationIcon} from "@heroicons/react/solid";
import {classNames} from "../utils/utils";

type AlertMessageProps = {
  message: string
  styles?: string
}

export const AlertMessage = (props: AlertMessageProps) => {
  return (
    <div className={classNames(props.styles, "bg-yellow-50 border-l-4 border-yellow-400 p-4")}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {props.message}
          </p>
        </div>
      </div>
    </div>
  )
}