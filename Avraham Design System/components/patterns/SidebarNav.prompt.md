The CRM's left rail. Collapses to a 72px icon rail; labels become tooltips.

```jsx
<SidebarNav items={[{section:"Operação"},{value:"inbox",label:"Inbox",icon:"message-square",count:23}]} value={view} onChange={setView} collapsed={rail} />
```

Group rows under 3–4 uppercase sections max. Counts are unread/open volumes only.
