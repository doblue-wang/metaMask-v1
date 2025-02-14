'use client';
import { Image, ProgressCircle } from 'antd-mobile'
import styles from './page.module.scss'
import React, { useRef, useState, useEffect, } from 'react'
// import NavBar from '@/components/NavBar/page';
import { useRouter } from 'next/navigation';
import { fetchGetMyMaxeralPoolList, fetchGetMyMineralPoolSummary } from '@/api/home';
import Empty from "@/components/empty/page";
export default function MyPool () {
    const [selectedTab, setSelectedTab] = useState(0);
    const [source, setSource] = useState({} as any);
    const [list, setList] = useState<any[]>([]);
    const tabs = [
        { id: 0, label: '矿池汇总' },
        { id: 1, label: '矿池列表' },
    ];
    const sortList = [
        { id: 0, label: 'POS总算力' },
        { id: 1, label: '注册时间' },
    ]
    const [sort, setSort] = useState(-1)
    const [selectedSort, setSelectedSort] = useState<number[]>([]); // 存储选中的排序项索引
    const [sortOrder, setSortOrder] = useState<{ [key: number]: 'ASC' | 'desc' }>({}); // 存储每个排序项的顺序

    const router = useRouter()

    const handleBack = () => {
        router.back()
    }
    const getSource = () => {
        const AccountId = localStorage.getItem('AccountId')
        fetchGetMyMineralPoolSummary({ AccountId }).then(({ data }) => {
            setSource(data);
        })
            .catch((e) => {
                console.log(e);
            });
    }

    const getList = () => {
        const AccountId = localStorage.getItem('AccountId')
        fetchGetMyMaxeralPoolList({
            AccountId, SortingTypes: [
                {
                    FieldName: "RegistrationTime",
                    SortingType: sortOrder[1]
                },
                {
                    FieldName: "POSSummary",
                    SortingType: sortOrder[0]
                }
            ]
        }).then(({ data }) => {
            setList(data)
        })
    }



    useEffect(() => {
        if (selectedTab === 0) {
            getSource()
        } else {
            getList()
        }
    }, [selectedTab])

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
        // 判断当前排序项是否已被选中
        const isSelected = selectedSort.includes(index);
        if (isSelected) {
            setSortOrder(prev => ({
                ...prev,
                [index]: prev[index] === 'ASC' ? 'desc' : 'ASC',
            }));
            // console.log(sortOrder);
        } else {
            // 如果没有选中，则添加到选中项，并设置升序
            setSelectedSort([...selectedSort, index]);
            setSortOrder(prev => ({
                ...prev,
                [index]: 'ASC', // 默认升序
            }));
            // console.log(sortOrder);
        }
    };
    useEffect(() => {
        getList()
    }, [sortOrder]);



    return (
        <div className={styles.page}>
            <div className={`${styles.top} ${selectedTab === 0 ? styles.active : ''}`}>
                <div className={styles.navbar}>
                    <div className={styles.navbar__logo} onClick={() => handleBack()}>
                        <Image lazy className={styles.navbar__logo_img} src="/images/recordArrow.png" />
                    </div>
                    <div className={styles.navbar__title}>我的矿池</div>
                    <div className={styles.navbar__links}></div>
                </div>
                <div className={styles.tabbox}>
                    {tabs.map((tab, index) => (
                        <div
                            key={tab.id}  // 使用 tab.id 作为唯一的 key
                            ref={(el: any) => (tabRefs.current[index] = el)}  // 使用 ref 数组存储每个 tab 的引用
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
                        </div>
                        <div className={styles.machinedetail}>
                            <div className={styles.detail_left}>
                                <div className={styles.detail_left_title}>{source?.MinerType?.Staking || 0} DTV</div>
                                <div className={styles.detail_left_content}>POS：{source?.MinerType?.Hashrate || 0}</div>
                            </div>
                            <div className={styles.detail_right}>
                                <Image lazy className={styles.detail_right_img} src="/pool/leave.png" />
                                <div className={styles.detail_right_title}>{source?.MinerType?.Name || '--'}</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.myMachine}>
                        <div className={styles.titlebox}>
                            <div className={styles.title}>
                                合格矿池
                                <div className={styles.txt}>POP：{source?.QualifiedPOPSummary || 0}</div>
                            </div>
                        </div>
                        <div className={styles.listbox}>
                            <div className={styles.listlabel}>
                                <div className={styles.txt}>矿池名称</div>
                                <div className={styles.txt}>完成时间</div>
                            </div>
                            {
                                (source?.QualifiedMiningPoolList || []).length > 0 ? <>
                                    {
                                        source?.QualifiedMiningPoolList.map((item: any, index: number) => <div key={index} className={styles.listitem}>
                                            <div className={styles.name}>{item?.MiningPoolName || '--'}</div>
                                            <div className={styles.time}>{item?.CompletionTime || '--'}</div>
                                        </div>)
                                    }
                                </> : <Empty />
                            }
                        </div>
                    </div>
                    <div className={styles.myMachine}>
                        <div className={styles.titlebox}>
                            <div className={styles.title}>
                                预备矿池
                                <div className={styles.txt}>POP：{source?.PreparationPOPSummary || 0}</div>
                            </div>
                        </div>
                        <div className={styles.listbox}>
                            <div className={styles.listlabel}>
                                <div className={styles.txt}>矿池名称</div>
                                <div className={styles.txt}>完成度</div>
                            </div>
                            {
                                (source?.PreparationMiningPoolList || []).length > 0 ?
                                    <>
                                        {
                                            source?.PreparationMiningPoolList.map((item: any, index: number) =>
                                                <div key={index} className={styles.listitem}>
                                                    <div className={styles.name}>{item?.MiningPoolName || '--'}</div>
                                                    <div className={styles.Circlebox}>
                                                        <div >{item?.MiningPoolSpeedOfProgress || 0}%</div>
                                                        <div className={styles.Circle}>
                                                            <ProgressCircle percent={item?.MiningPoolSpeedOfProgress || 0} style={{ '--track-width': '4px', '--track-color': 'rgba(255,110,145,0.1)', '--fill-color': '#FF6E91', '--size': '18px' }} />
                                                        </div>
                                                    </div>
                                                </div>)
                                        }
                                    </> : <Empty />

                            }

                        </div>

                    </div>
                </div>
            ) : selectedTab == 1 ? (
                <div className={styles.poolbox}>
                    {/* //排序 */}
                    <div className={styles.sortbox}>
                        {sortList.map((item, index) => (
                            <div
                                key={index}
                                className={styles.sortitem}
                                onClick={() => handleSortClick(index)}
                            >
                                <div className={`${styles.sorttxt} ${selectedSort.includes(index) ? styles.active : ''}`}>
                                    {item.label}
                                </div>
                                <div className={styles.arrowbox}>
                                    <div
                                        className={`${styles.uparrow} ${selectedSort.includes(index) && sortOrder[index] === 'ASC' ? styles.active : ''
                                            }`}
                                    ></div>
                                    <div
                                        className={`${styles.downarrow} ${selectedSort.includes(index) && sortOrder[index] === 'desc' ? styles.active : ''
                                            }`}
                                    ></div>
                                </div>
                            </div>
                        ))}


                    </div>
                    <div className={styles.poollist}>
                        {
                            (list || []).length > 0 ? <>
                                {
                                    list.map((item: any, index: any) => <div key={index} className={item?.MiningPoolSpeedOfProgress >= 1 ? styles.listitem : styles.listitem1}>
                                        <div className={styles.userbox}>
                                            <div className={styles.userleft}>
                                                <Image lazy className={styles.userimg} src={item?.AccountImg || null} alt="" />
                                                <div className={styles.usernamebox}>
                                                    <div className={styles.username}>{item.AccountName || ''}</div>
                                                    {
                                                        item.MiningPoolSpeedOfProgress < 1 ? <div className={styles.Circlebox}>
                                                            <ProgressCircle percent={item.MiningPoolSpeedOfProgress * 100} style={{ '--track-width': '4px', '--track-color': 'rgba(255,110,145,0.1)', '--fill-color': '#FF6E91', '--size': '18px' }} />
                                                            <div className={styles.cricetxt}>{item.MiningPoolSpeedOfProgress * 100}%</div>
                                                        </div> : null
                                                    }
                                                    {
                                                        item?.MiningPoolSpeedOfProgress >= 1 ? <div className={styles.tag}>算力达标</div> : null
                                                    }

                                                </div>
                                            </div>
                                            <div className={styles.usertime}>
                                                {
                                                    (() => {
                                                        const timestamp = item.CompletionTime; // 假设是一个时间戳
                                                        const date = new Date(timestamp); // 将时间戳转为 Date 对象
                                                        // 格式化为可读的日期格式
                                                        const formattedDate = date.toLocaleDateString(); // 格式化日期
                                                        const formattedTime = date.toLocaleTimeString(); // 格式化时间
                                                        return <>
                                                            <span> {formattedDate}</span>
                                                            <p> {formattedTime}</p>
                                                        </>
                                                    })()
                                                }

                                            </div>
                                        </div>
                                        <div className={styles.contentbox}>
                                            <div className={styles.item}>
                                                <div className={styles.label}>矿机数量：</div>
                                                <div className={styles.value}>{item.NumberOfMiningMachines || 0}</div>
                                            </div>
                                            <div className={styles.item1}>
                                                <div className={styles.label}>POS总算力：</div>
                                                <div className={styles.value}>{item.POSSummary || 0}</div>
                                            </div>
                                            <div className={styles.item}>
                                                <div className={styles.label}>备注：</div>
                                                <div className={styles.value}>{item.Description || "--"}</div>
                                            </div>
                                        </div>
                                    </div>)
                                }

                            </> : <Empty />
                        }

                    </div>


                </div>
            ) : null}


        </div>
    )
}