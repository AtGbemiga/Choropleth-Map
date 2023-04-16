let urlOne = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let urlTwo = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let urlValOne
let urlValTwo

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let plotMap = () => {
    svg.selectAll('path')
        .data(urlValOne)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', item => {
            let id =  item.id
            let valOneLoca = urlValTwo.find(item => {
                return item.fips === id
            })
            let percent = valOneLoca.bachelorsOrHigher
            if(percent <= 15) {
                return 'grey'
            } else if(percent <= 30) {
                return 'yellow'
            } else if(percent <= 60) {
                return 'blue'
            } else {
                return 'green'
            }
        })
        .attr('data-fips', item => {
            return item.id
        })
        .attr('data-education', item => {
            let id =  item.id
            let valOneLoca = urlValTwo.find(item => {
                return item.fips === id
            })
            let percent = valOneLoca.bachelorsOrHigher
            return percent
        })
        .on('mouseover', item => {
            tooltip.transition()
                .style('visibility', 'visible')
                let id =  item.id
                let valOneLoca = urlValTwo.find(item => {
                    return item.fips === id
                })
                tooltip.text( `${valOneLoca.area_name}, ${valOneLoca.bachelorsOrHigher}%`)
                .attr('data-education', item => {
                    return valOneLoca.bachelorsOrHigher
                })
        })
        .on('mouseout', item => {
            tooltip.style('visibility', 'hidden')
        })
}


d3.json(urlOne).then(
    (data, error) => {
        if(error){
            console.log(error)
        }else{
            urlValOne = data
            urlValOne = topojson.feature(urlValOne, urlValOne.objects.counties).features
            console.log('urlValOne')
            console.log(urlValOne)

            d3.json(urlTwo).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }
                    else{
                        urlValTwo = data
                        console.log('urlValTwo')
                        console.log(urlValTwo)
                        plotMap()
                    }
                }
            )

        }
    }
)