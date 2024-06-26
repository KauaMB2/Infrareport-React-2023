import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import './styles/Reports.css'

const Reports = ({reportsLabels, reportsCount, typeLabels, typeCount}) => {
    const reportsData = {
        labels: reportsLabels,
        datasets: [
            {
                label: 'Dataset 1',
                data: reportsCount,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    }
    const typeData = {
        labels: typeLabels,
        datasets: [
            {
                label: 'Dataset 1',
                data: typeCount,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    }
    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    }

    return (
        <div className='reports'>
            <div className='charts_div'>
                <div className='chart_item'>
                    <h3>Ocorrências mais frequentes:</h3>
                    <Bar className='bar_chart' data={typeData} options={options} />
                </div>
                <div className='chart_item'>
                    <h3>Ruas com mais ocorrências:</h3>
                    <Bar className='bar_chart' data={reportsData} options={options} />
                </div>
            </div>
        </div>
    )
}

export default Reports