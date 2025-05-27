import { GaugeComponent } from 'react-gauge-component';

const ManagerMeter: React.FC<{ todayTarget: number }> = ({ todayTarget }) => {
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
        {/* <GaugeComponent
          className="w-full"
          //   arc={{
          //     nbSubArcs: 150,
          //     colorArray: ['#EA4228', '#F5CD19', '#5BE12C'],
          //     width: 0.25,
          //     padding: 0.003,
          //   }}
          type="grafana"
          arc={{
            // nbSubArcs: 150,
            colorArray: ['#EA4228', '#F5CD19', '#5BE12C'],
            subArcs: [{ limit: 10 }, {}, {}, {}, {}, {}, {}],
            padding: 0.02,
            width: 0.3,
          }}
          pointer={{
            type: 'arrow',
            elastic: true,
            animationDelay: 0,
          }}
          labels={{
            valueLabel: {
              //   fontSize: 40,
              formatTextValue: kbitsToMbits, // Function to format value
            },
            tickLabels: {
              type: 'outer',
              ticks: [
                { value: 10000 },
                { value: 20000 },
                { value: 30000 },
                { value: 40000 },
              ],
              //   valueConfig: {
              //     formatTextValue: kbitsToMbits, // Function to format ticks
              //   },
            },
          }}
          value={25000} // Example current value
          maxValue={50000} // Maximum value of the gauge
        /> */}
        <GaugeComponent
          className="w-full"
          // arc={{
          //   nbSubArcs: 150,
          //   colorArray: ['#EA4228', '#F5CD19', '#5BE12C'],
          //   width: 0.25,
          //   padding: 0.003,
          // }}
          type="grafana"
          arc={{
            // nbSubArcs: 150,
            colorArray: ['#EA4228', '#F5CD19', '#5BE12C'],
            subArcs: [
              { limit: 200 },
              { limit: 400 },
              { limit: 600 },
              { limit: 800 },
              { limit: 1000 },
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
              //   fontSize: 40,
              formatTextValue: kbitsToMbits, // Function to format value
            },
            // tickLabels: {
            //   type: 'outer',
            //   ticks: [
            //     { value: 10000 },
            //     { value: 20000 },
            //     { value: 30000 },
            //     { value: 40000 },
            //   ],
            //   //   valueConfig: {
            //   //     formatTextValue: kbitsToMbits, // Function to format ticks
            //   //   },
            // },
          }}
          value={todayTarget} // Example current value
          maxValue={1000} // Maximum value of the gauge
        />
        {/* <GaugeComponent
        className='w-full flex justify-center'
          id="gauge-component4"
          arc={{
            gradient: true,
            width: 0.15,
            padding: 0,
            subArcs: [
              {
                limit: 15,
                color: '#EA4228',
                showTick: true,
              },
              {
                limit: 37,
                color: '#F5CD19',
                showTick: true,
              },
              {
                limit: 58,
                color: '#5BE12C',
                showTick: true,
              },
              {
                limit: 75,
                color: '#F5CD19',
                showTick: true,
              },
              { color: '#EA4228' },
            ],
          }}
          value={50}
          pointer={{ type: 'arrow', elastic: true }}
        /> */}
      </div>
    </>
  );
};

export default ManagerMeter;
