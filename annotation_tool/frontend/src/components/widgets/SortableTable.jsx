import _ from "lodash";
import React, { useState } from "react";
import Logger from "src/Logger";
const log = Logger("SortableTable", "white");
/**
 * @template T
 * @typedef SortableTableColumsn
 * @param {string} name
 * @param {(T) => any} display_fn
 * @param {(T) => any} id_fn
 * @param {(T) => any} sort_fn
 */
/**
 * @param {Object} params
 * @param {string} params.id
 * @param {T[]} params.items
 * @param {SortableTableColumn[]} params.columns
 * @param {(T)=>string|number} params.id_fn - a function that gets some unique value for the item (for React keys)
 * @returns
 */
export default function SortableTable({ id, items, columns, sortColumnIdx, id_fn = (item) => item.id }) {
  const [sortColumn, setSortColumn] = useState(columns[sortColumnIdx || 0]);
  const [reverseColumn, setReverseColumn] = useState(false);
  const sorted_items = (reverseColumn ? _.reverse : (e) => e)(
    _.sortBy(items, sortColumn.sort_fn ?? sortColumn.display_fn)
  );
  return (
    <table id={id} className="sortable-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              onClick={() => {
                log(`${column.name}, ${sortColumn.name}, ${column.name == sortColumn.name}`);
                if (column.name == sortColumn.name) {
                  setReverseColumn(!reverseColumn);
                } else {
                  setSortColumn(column);
                }
              }}
              key={column.name}
              className={[
                column.name == sortColumn.name ? "selected" : "",
                reverseColumn ? "reversed" : "normal",
              ].join(" ")}
            >
              {column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted_items.map((item, tr_idx) => (
          <tr id={`tr-${id_fn(item)}`} key={tr_idx}>
            {columns.map((column) => (
              <td key={column.name}>{column.display_fn(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
