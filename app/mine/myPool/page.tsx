'use client';
import { Image, Popup, NavBar, ProgressCircle } from 'antd-mobile'
import styles from './page.module.scss'
import React, { useRef, useState, useEffect, } from 'react'
// import NavBar from '@/components/NavBar/page';
import { useRouter } from 'next/navigation';
export default function MyPool() {
    const [selectedTab, setSelectedTab] = useState(0);
    const tabs = [
        { id: 0, label: '矿池汇总' },
        { id: 1, label: '矿池列表' },
        // 你可以继续添加更多 tab 项
    ];
    const sortList = [
        { id: 0, label: 'POS总算力' },
        { id: 1, label: '注册时间' },
    ]
    const [sort, setSort] = useState(-1)
    const [sortOrder, setSortOrder] = useState("asc"); // 默认升序
    const router = useRouter()
    const handleBack = () => {
        router.back()
    }
    const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [colorBarPosition, setColorBarPosition] = useState(0);
    const getTabOffset = (index: number) => {
        return tabRefs.current[index] ? tabRefs.current[index]!.offsetLeft : 40;
    };
    useEffect(() => {
        const initialOffset = getTabOffset(selectedTab);
        setColorBarPosition(initialOffset + (72 - 36) / 2);  // Color bar width is 36px, center it under the tab
    }, [selectedTab]);
    const handleTabClick = (index: number) => {
        setSelectedTab(index);
    };
    const handleSortClick = (index: number) => {
        setSort(index)
        if (sortOrder === "asc") {
            setSortOrder("desc");
        } else {
            setSortOrder("asc");
        }
    }
    useEffect(() => {
        setSortOrder("desc");
    }, [sort])
    return (
        <div className={styles.page}>
            <div className={`${styles.top} ${selectedTab === 0 ? styles.active : ''}`}>
                <div className={styles.navbar}>
                    <div className={styles.navbar__logo} onClick={() => handleBack()}>
                        <Image className={styles.navbar__logo_img} src="/images/recordArrow.png" />
                    </div>
                    <div className={styles.navbar__title}>我的矿池</div>
                    <div className={styles.navbar__links}></div>
                </div>
                <div className={styles.tabbox}>
                    {tabs.map((tab, index) => (
                        <div
                            key={tab.id}  // 使用 tab.id 作为唯一的 key
                            ref={(el) => (tabRefs.current[index] = el)}  // 使用 ref 数组存储每个 tab 的引用
                            className={`${styles.tab} ${selectedTab === index ? styles.active : ''}`}
                            onClick={() => handleTabClick(index)}  // 点击时切换选中的 tab
                        >
                            {tab.label}  {/* 渲染每个 tab 的标签 */}
                        </div>
                    ))}
                    <div className={styles.colorBar} style={{
                        width: '36px',  // 颜色条的宽度比 tab 短 12px，固定为 36px
                        left: `${colorBarPosition + 6}px`,  // 动态计算颜色条的位置
                    }}></div>

                </div>
            </div>
            {selectedTab == 0 ? (
                <div className={styles.content}>
                    <div className={styles.myMachine}>
                        <div className={styles.titlebox}>
                            <div className={styles.title}>我的矿机</div>
                            <Image className={styles.titleimg} src="/mine/share.png" />
                        </div>
                        <div className={styles.machinedetail}>
                            <div className={styles.detail_left}>
                                <div className={styles.detail_left_title}>20,000 DTV</div>
                                <div className={styles.detail_left_content}>POS：100</div>
                            </div>
                            <div className={styles.detail_right}>
                                <Image className={styles.detail_right_img} src="/pool/leave.png" />
                                <div className={styles.detail_right_title}>小型矿机</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.myMachine}>
                        <div className={styles.titlebox}>
                            <div className={styles.title}>
                                合格矿池
                                <div className={styles.txt}>POP：160w</div>
                            </div>
                            <Image className={styles.titleimg} src="/mine/share.png" />
                        </div>
                        <div className={styles.listbox}>
                            <div className={styles.listlabel}>
                                <div className={styles.txt}>矿池名称</div>
                                <div className={styles.txt}>完成时间</div>
                            </div>
                            <div className={styles.listitem}>
                                <div className={styles.name}>矿池AAAA</div>
                                <div className={styles.time}>2023-12-12 12:12:12</div>
                            </div>
                            <div className={styles.listitem}>
                                <div className={styles.name}>矿池AAAA</div>
                                <div className={styles.time}>2023-12-12 12:12:12</div>
                            </div>
                        </div>

                    </div>
                    <div className={styles.myMachine}>
                        <div className={styles.titlebox}>
                            <div className={styles.title}>
                                合格矿池
                                <div className={styles.txt}>POP：160w</div>
                            </div>
                            <Image className={styles.titleimg} src="/mine/share.png" />
                        </div>
                        <div className={styles.listbox}>
                            <div className={styles.listlabel}>
                                <div className={styles.txt}>矿池名称</div>
                                <div className={styles.txt}>完成度</div>
                            </div>
                            <div className={styles.listitem}>
                                <div className={styles.name}>矿池AAAA</div>
                                <div className={styles.Circlebox}>
                                    <div >21%</div>
                                    <div className={styles.Circle}>
                                        <ProgressCircle percent={75} style={{ '--track-width': '4px', '--track-color': 'rgba(255,110,145,0.1)', '--fill-color': '#FF6E91', '--size': '18px' }} />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.listitem}>
                                <div className={styles.name}>矿池AAAA</div>
                                <div className={styles.Circlebox}>
                                    <div >21%</div>
                                    <div className={styles.Circle}>
                                        <ProgressCircle percent={75} style={{ '--track-width': '4px', '--track-color': 'rgba(255,110,145,0.1)', '--fill-color': '#FF6E91', '--size': '18px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            ) : selectedTab == 1 ? (
                <div className={styles.poolbox}>
                    {/* //排序 */}
                    <div className={styles.sortbox}>
                        {
                            sortList.map((item: any, index: number) => {
                                return (
                                    <div key={index} className={styles.sortitem} onClick={() => handleSortClick(index)}>
                                        <div className={`${styles.sorttxt} ${sort == index ? styles.active : ''}`}>{item.label}</div>
                                        <div className={styles.arrowbox}>
                                            <div className={`${styles.uparrow} ${sort == index && sortOrder == 'asc' ? styles.active : ''}`}></div>
                                            <div className={`${styles.downarrow} ${sort == index && sortOrder == 'desc' ? styles.active : ''} `} ></div>
                                        </div>
                                    </div>
                                )
                            })
                        }


                    </div>
                    <div className={styles.poollist}>
                        <div className={styles.listitem}>
                            <div className={styles.userbox}>
                                <div className={styles.userleft}>
                                    <Image className={styles.userimg} src="/mine/receives.png" alt="" />
                                    <div className={styles.usernamebox}>
                                        <div className={styles.username}>用户名</div>
                                        {/* <div className={styles.Circlebox}>
                                            <ProgressCircle percent={75} style={{ '--track-width': '4px', '--track-color': 'rgba(255,110,145,0.1)', '--fill-color': '#FF6E91', '--size': '18px' }} />
                                            <div className={styles.cricetxt}>Lv.1</div>
                                            </div> */}
                                        <div className={styles.tag}>算力达标</div>
                                    </div>
                                </div>
                                <div className={styles.usertime}>2023-12-12 12:12:12</div>
                            </div>
                            <div className={styles.contentbox}>
                                <div className={styles.item}>
                                    <div className={styles.label}>矿机数量：</div>
                                    <div className={styles.value}>20</div>
                                </div>
                                <div className={styles.item1}>
                                    <div className={styles.label}>POS总算力：</div>
                                    <div className={styles.value}>30000</div>
                                </div>
                                <div className={styles.item}>
                                    <div className={styles.label}>备注：</div>
                                    <div className={styles.value}>XXXXXX</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.listitem}>
                            <div className={styles.userbox}>
                                <div className={styles.userleft}>
                                    <Image className={styles.userimg} src="/mine/receives.png" alt="" />
                                    <div className={styles.usernamebox}>
                                        <div className={styles.username}>用户名</div>
                                        <div className={styles.Circlebox}>
                                            <ProgressCircle percent={75} style={{ '--track-width': '4px', '--track-color': 'rgba(255,110,145,0.1)', '--fill-color': '#FF6E91', '--size': '18px' }} />
                                            <div className={styles.cricetxt}>Lv.1</div>
                                        </div>
                                        {/* <div className={styles.tag}>算力达标</div> */}
                                    </div>
                                </div>
                                <div className={styles.usertime}>2023-12-12 12:12:12</div>
                            </div>
                            <div className={styles.contentbox}>
                                <div className={styles.item}>
                                    <div className={styles.label}>矿机数量：</div>
                                    <div className={styles.value}>20</div>
                                </div>
                                <div className={styles.item1}>
                                    <div className={styles.label}>POS总算力：</div>
                                    <div className={styles.value}>30000</div>
                                </div>
                                <div className={styles.item}>
                                    <div className={styles.label}>备注：</div>
                                    <div className={styles.value}>XXXXXX</div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            ) : null}


        </div>
    )
}