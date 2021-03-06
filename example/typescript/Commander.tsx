import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { SplitterGrid } from 'grid-splitter-react'
import { FolderTable, setFolderItems, folderItemsChanged } from 'file-commander-control'
import { FolderTableItem, FolderTableItems } from '../../dist/FolderTable'
import { Column, TableItem } from 'virtual-table-react'

interface FolderItem extends FolderTableItem {
    index: number
    col2: string
    col3: string
}

type CommanderProps = {
    theme: string
}

export const Commander = ({theme}: CommanderProps) => {
// ============================== States =======================================

    const [focusedLeft, setFocusedLeft] = useState(false)
    const [focusedRight, setFocusedRight] = useState(false)

    const [pathLeft, setPathLeft] = useState("")
    const [pathRight, setPathRight] = useState("")
    const setPath = (folderId: 1|2) => folderId == 1 ? setPathLeft : setPathRight

    const [columnsLeft, setColumnsLeft] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true }
    ] as Column[])
    const [columnsRight, setColumnsRight] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true }
    ] as Column[])

    const [itemsLeft, setItemsLeft ] = useState(setFolderItems({ items: [] }) as FolderTableItems)
    const [itemsRight, setItemsRight ] = useState(setFolderItems({ items: [] }) as FolderTableItems)
    const setItems = (folderId: 1|2) => folderId == 1 ? setItemsLeft : setItemsRight

    const onSetFocusLeft = () => {
        setFocusedLeft(true)
        setFocusedRight(false)
    }   
    const onSetFocusRight = () => {
        setFocusedLeft(false)
        setFocusedRight(true)
    }   

    const onPathChangedLeft = (path: string) => {
        alert(path)
        onChange(1)
    }
    const onPathChangedRight = (path: string) => {
        alert(path)
        onChange(2)
    }

    const onColsChangedLeft = (cols: Column[])=> {}
    const onColsChangedRight = (cols: Column[])=> {}
    const onSortLeft = ()=> {}
    const onSortRight = ()=> {}

// ============================== States =======================================

    const onChange = (folderId: 1|2) => {
        setPath (folderId) ("/home/uwe/documents")
        const folderItems = Array.from(Array(6000).keys()).map(index => ({ name: `Name ${index}`, col2: `Adresse ${index}`, col3: `Größe ${index}`, index: index} as FolderItem))
        setItems (folderId) (setFolderItems({ items: folderItems}))
    }

    useEffect(() => setFocusedLeft(true), [])
    const activeFolder = useRef<1|2>(1)
    useLayoutEffect(() => {
        if (focusedLeft)
            activeFolder.current = 1
        else if (focusedRight)
            activeFolder.current = 2
    }, [focusedLeft, focusedRight])

    const onChangeActive = () => onChange(activeFolder.current)

    const onEnter = (items: FolderTableItem[]) => {
        console.log("Enter", items)
    }

    const itemRenderer = (item: TableItem) => {
        const tableItem = item as FolderItem
        return [
            <td key={1}>{tableItem.name}</td>,
            <td key={2}>{tableItem.col2}</td>,
            <td key={3}>{tableItem.col3}</td>	
	    ]
    }

    return (	
        <div className={"commander"}>
            <button onClick={onChangeActive}>Fill</button>
            <button onClick={onSetFocusLeft}>Set Focus</button>
            <SplitterGrid 
                first={(
                    <FolderTable 
                        theme={theme} 
                        focused={focusedLeft} 
                        setFocused={setFocusedLeft} 
                        columns={columnsLeft} 
                        onColumnsChanged={onColsChangedLeft} 
                        onSort={onSortLeft}
                        items={itemsLeft}
                        itemRenderer={itemRenderer}
                        onItemsChanged={setItemsLeft}
                        path={pathLeft}
                        onPathChanged={onPathChangedLeft}
                        onEnter={onEnter} /> 
                )} 
                second={(
                    <FolderTable 
                        theme={theme} 
                        focused={focusedRight} 
                        setFocused={setFocusedRight} 
                        columns={columnsRight} 
                        onColumnsChanged={onColsChangedRight} 
                        onSort={onSortRight}
                        items={itemsRight}
                        itemRenderer={itemRenderer}
                        onItemsChanged={setItemsRight}
                        path={pathRight}
                        onPathChanged={onPathChangedRight}
                        onEnter={onEnter} /> 
                )} 
            />
        </div>
    )
}