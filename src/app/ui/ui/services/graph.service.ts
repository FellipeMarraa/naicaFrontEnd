import { Injectable } from "@angular/core";
import { GraphComponent } from "../graph/graph.component";

@Injectable()
export class GraphService {
  byId(id: string, graphs: GraphComponent[]) {
    if (graphs) {
      graphs.forEach((graph: GraphComponent) => {
        if (graph.id === id) {
          return graph;
        }
      });
    }

    return null;
  }
}
