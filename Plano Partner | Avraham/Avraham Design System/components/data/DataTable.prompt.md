Row list for CRM records. Hairline rules only — no zebra striping, no outer border (wrap it in a `Card` with `pad={0}`).

```jsx
<DataTable columns={[{key:"name",label:"Contato"},{key:"deals",label:"Deals",mono:true,align:"right"}]} rows={rows} onRowClick={openContact} />
```
