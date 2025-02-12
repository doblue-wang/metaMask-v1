'use client';
import styles from "./page.module.scss";
import { Image } from 'antd-mobile'
export default function empty () {
    return (
        <div className={styles.empty}>
            <Image height={140} width={140} lazy className={styles.img} src='/pool/empty.png' />
            <div className={styles.emptytext}>暂无记录~</div>
        </div>

    )
}