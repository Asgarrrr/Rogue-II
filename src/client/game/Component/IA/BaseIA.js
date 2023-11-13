
export class BaseIA {

    path = [ ];

    constructor( ) {

        if ( this.constructor === BaseIA )
            throw new Error( "Abstract classes can't be instantiated." );

    }

    calculatePathTo(
        fx, fy, tx, ty, map 
    ) {

        const path = [ ];

        const dijkstra = new ROT.Path.Dijkstra( tx, ty, ( x, y ) => {
            return map[ `${ x },${ y }` ]
        }, {

        });

        // dijkstra.compute(entity.x, entity.y, (x: number, y: number) => {

        // const isPassable = (x: number, y: number) => gameMap.tiles[y][x].walkable;
        // const dijkstra = new ROT.Path.Dijkstra(destX, destY, isPassable, {});
    
        // this.path = [];
    
        // dijkstra.compute(entity.x, entity.y, (x: number, y: number) => {
        //   this.path.push([x, y]);
        // });
        // this.path.shift();
      }

    act( e, c ) {
        throw new Error( "Method 'act()' must be implemented." );
    }

}