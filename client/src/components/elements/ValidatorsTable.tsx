import React from "react";

import { IValidators } from "../../db";
import { classNames } from "../utils/classNames";

type ValidatorsTableProps = {
  validators: IValidators[];
  styles?: string;
};

const ValidatorsTable = (props: ValidatorsTableProps) => {
  return (
    <div className={classNames(props.styles, "flex flex-col")}>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Peer_Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Joined_Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.validators &&
                  props.validators.map((validator, validatorIdx) => (
                    <tr
                      key={validator.id}
                      className={validatorIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {validator.peerId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {validator.joinedTime}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsTable;
