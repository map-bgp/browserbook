// import React, { useState } from 'react'
//
// import { useAppSelector, useAppDispatch } from '../../store/hooks'
//
// import { decrement, increment } from '../../slices/demo/peerSlice'
//
// export function Counter() {
//   // The `state` arg is correctly typed as `RootState` already
//   const count = useAppSelector(state => state.counter.value)
//   const dispatch = useAppDispatch()
//
//   return (
//     <div>
//         <div>
//           <button
//             aria-label="Increment value"
//             onClick={() => dispatch(increment())}
//           >
//             Increment
//           </button>
//           <span>{count}</span>
//           <button
//             aria-label="Decrement value"
//             onClick={() => dispatch(decrement())}
//           >
//             Decrement
//           </button>
//         </div>
//     </div>
//   )
// }