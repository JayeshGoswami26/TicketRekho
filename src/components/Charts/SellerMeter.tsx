// import { GaugeComponent } from 'react-gauge-component';

// const SellerMeter: React.FC<{ totalSales: number }> = ({ totalSales }) => {
//   const kbitsToMbits = (value: number): string => {
//     if (value >= 1) {
//       value = value / 1;
//       if (Number.isInteger(value)) {
//         return value.toFixed(0) + '';
//       } else {
//         return value.toFixed(1) + '';
//       }
//     } else {
//       return value.toFixed(0) + '';
//     }
//   };

//   return (
//     <>
//       <div className="rounded-sm border  p-5 shadow-default border-strokedark bg-boxdark sm:px-7.5 flex items-center justify-center  xl:col-span-2">
//         <GaugeComponent
//           className="w-full"
//           type="grafana"
//           arc={{
//             // nbSubArcs: 150,
//             colorArray: ['#EA4228', '#F5CD19', '#5BE12C'],
//             subArcs: [{ limit: 10 }, {}, {}, {}, {}, {}, {}],
//             padding: 0.02,
//             width: 0.1,
//           }}
//           pointer={{
//             type: 'arrow',
//             elastic: true,
//             animationDelay: 0,
//           }}
//           labels={{
//             valueLabel: {
//               //   fontSize: 40,
//               formatTextValue: kbitsToMbits,
//             },
//           }}
//           value={totalSales}
//           maxValue={10}
//         />
//       </div>
//     </>
//   );
// };

// export default SellerMeter;



import { GaugeComponent } from 'react-gauge-component';

const SellerMeter: React.FC<{ totalSales: number }> = ({ totalSales }) => {
  const kbitsToMbits = (value: number): string => {
    if (value >= 1) {
      value = value / 1;
      if (Number.isInteger(value)) {
        return value.toFixed(0) + '';
      } else {
        return value.toFixed(1) + '';
      }
    } else {
      return value.toFixed(0) + '';
    }
  };

  return (
    <>
      <div className="rounded-sm border  p-5 shadow-default border-strokedark bg-boxdark sm:px-7.5 flex items-center justify-center  xl:col-span-2">
        <GaugeComponent
          className="w-full"
          type="grafana"
          arc={{
            colorArray: ['#EA4228', '#F5CD19', '#5BE12C'], // Red, Yellow, Green
            subArcs: [
              { limit: 2 }, // Red for values up to ~33%
              { limit: 4 },
              { limit: 6 },
              { limit: 8 }, // Yellow for values between ~33% and ~66%
              { limit: 10 }, // Green for values above ~66%
            ],
            padding: 0.02,
            width: 0.1,
          }}
          pointer={{
            type: 'arrow',
            elastic: true,
            animationDelay: 0,
          }}
          labels={{
            valueLabel: {
              formatTextValue: kbitsToMbits,
            },
          }}
          value={totalSales}
          maxValue={10}
        />
      </div>
    </>
  );
};

export default SellerMeter;
