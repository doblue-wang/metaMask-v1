'use client';
import styles from './page.module.scss'
import { Image } from 'antd-mobile'
import { useRouter } from 'next/navigation'
// 声明 props 的类型
interface NavBarProps {
    title: string;  // title 属性是一个字符串
}
export default function NavBar ({ title }: NavBarProps) {
    const router = useRouter()
    const handleBack = () => {
        router.back()
    }
    return (
        <div className={styles.navbar}>
            <div className={styles.navbar__logo} onClick={() => handleBack()}>
                <Image className={styles.navbar__logo_img} src="/images/recordArrow.png" />
            </div>
            <div className={styles.navbar__title}>{title}</div>
            <div className={styles.navbar__links}></div>
        </div>
    )
}