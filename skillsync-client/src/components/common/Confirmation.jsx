import React from 'react';
import PropTypes from 'prop-types';
import { confirmable, createConfirmation } from 'react-confirm';

const Dialog = ({ show, proceed, confirmation }) => (
    <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
            show ? 'visible fade-in' : 'invisible'
        }`}
    >
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur">
            <div className="flex items-center justify-center h-full">
                <div className="bg-[#1e1e1e] p-4 rounded shadow-lg">
                    <div className="mb-4">{confirmation}</div>
                    <div className="flex justify-end">
                        <button
                            className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
                            onClick={() => proceed(false)}
                        >
                            CANCEL
                        </button>
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded"
                            onClick={() => proceed(true)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

Dialog.propTypes = {
  show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  confirmation: PropTypes.string,  // arguments of your confirm function
  options: PropTypes.object        // arguments of your confirm function
}

// confirmable HOC pass props [`show`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22path%22%3A%22%2Fworkspaces%2Fskillsync-suprema%2Fskillsync-client%2Fsrc%2Fcomponents%2Fcommon%2FConfirmation.jsx%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A6%2C%22character%22%3A16%7D%5D "skillsync-client/src/components/common/Confirmation.jsx"), `dismiss`, `cancel` and [`proceed`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22path%22%3A%22%2Fworkspaces%2Fskillsync-suprema%2Fskillsync-client%2Fsrc%2Fcomponents%2Fcommon%2FConfirmation.jsx%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A6%2C%22character%22%3A16%7D%5D "skillsync-client/src/components/common/Confirmation.jsx") to your component.
const ConfirmableDialog = confirmable(Dialog);

// create confirm function
export const confirm = createConfirmation(ConfirmableDialog);

// This is optional. But wrapping function makes it easy to use.
export function confirmWrapper(confirmation, options = {}) {
  return confirm({ confirmation, options });
}