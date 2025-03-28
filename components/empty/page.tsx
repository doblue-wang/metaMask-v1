'use client';
import { px2rem } from "@/utils/pxToRem";
import styles from "./page.module.scss";
// import { Image } from 'antd-mobile'
import Image from "next/image";
import { t } from "i18next";
export default function empty () {
    return (
        <div className={styles.empty}>
            <Image height={140} width={140} alt="" className={styles.img} src='/pool/empty.png' />
            <div className={styles.emptytext}> {t('暂无记录')}~</div>
        </div>

    )
}