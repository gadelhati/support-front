import { useState } from 'react'
import { SideContainerTitle, SideContainerItem, SidebarContainer, SidebarContainerHeader } from '../template/flex'
import { Icon } from '../../assets/svg.access'
import { Tooltip } from '../tooltip/tooltip'
import { UriScreenFormat } from '../../service/uri.format'
import { getPayload, getRoles } from '../../service/service.token'

export const SideContainer = () => {
  const [side, setSide] = useState(true)
  const showSideBar = () => { setSide(!side) }
  // const vector: string[][] = [
  //   ["tooltip host", "cpu-fill", "host"],
  //   ["tooltip user", "people-circle", "userEntity"],
  //   ["tooltip role", "chat-quote-fill", "role"],
  // ]

  return (
    <SidebarContainer sidehide={side}>
      <SidebarContainerHeader>
        <SideContainerTitle key={0} href={`#/`} onClick={showSideBar} ><Icon name="speedometer" /><p>CHM</p></SideContainerTitle>
        {/* {vector.map((element) => {
          return <SideContainerItem key={element[1]} href={`#/${element[2]}`} ><Tooltip data-tip={element[0].replaceAll('_', ' ')}><Icon name={element[1]} /></Tooltip><p>{UriScreenFormat(element[2])}</p></SideContainerItem>
        })} */}
        <SideContainerItem href={`#/${'host'}`} ><Tooltip data-tip="tooltip host"><Icon name="cpu-fill" /></Tooltip><p>{UriScreenFormat("host")}</p></SideContainerItem>
        {getRoles().includes("ROLE_ADMIN") || getRoles().includes("ROLE_MODERATOR") &&
          <SideContainerItem href={`#/${'useEntity'}`} ><Tooltip data-tip="tooltip user"><Icon name="people-circle" /></Tooltip><p>{UriScreenFormat("user")}</p></SideContainerItem>
        }
        {getRoles().includes("ROLE_ADMIN") &&
          <SideContainerItem href={`#/${'role'}`} ><Tooltip data-tip="tooltip role"><Icon name="chat-quote-fill" /></Tooltip><p>{UriScreenFormat("role")}</p></SideContainerItem>
        }
      </SidebarContainerHeader>
      <SideContainerItem element={'final'}  href={`#/${'profile'}`} ><Tooltip data-tip="tooltip profile"><Icon name="people-circle" /></Tooltip><p>{getPayload().sub}</p></SideContainerItem>
    </SidebarContainer>
  )
}