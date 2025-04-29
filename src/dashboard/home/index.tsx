import { Calendar } from "primereact/calendar";
import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TasksWidget } from "dashboard/tasks/widget";
import { useStore } from "store/hooks";
import { RecentMessages } from "dashboard/home/recent-messages";
import "./index.css";

export const Home = (): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;
    const [isSalesPerson, setIsSalesPerson] = useState(true);
    useEffect(() => {
        if (authUser && Object.keys(authUser.permissions).length) {
            const { permissions } = authUser;
            const { uaSalesPerson, ...otherPermissions } = permissions;
            if (Object.values(otherPermissions).some((permission) => permission === 1)) {
                return setIsSalesPerson(false);
            }
            if (!!uaSalesPerson) setIsSalesPerson(true);
        }
    }, [authUser, authUser?.permissions]);
    const [date] = useState(null);

    return (
        <div className='grid home-page'>
            <div className='col-12'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Common tasks</h2>
                    </div>
                    <div className='card-content common-tasks-menu flex flex-wrap lg:justify-content-between md:justify-content-center gap-6'>
                        {isSalesPerson || (
                            <>
                                <Link
                                    to='contacts/create'
                                    className='common-tasks-menu__item new-contact cursor-pointer'
                                >
                                    <div className='common-tasks-menu__icon new-contact'></div>
                                    New Contact
                                </Link>
                                <Link
                                    to='contacts'
                                    className='common-tasks-menu__item cursor-pointer'
                                >
                                    <div className='common-tasks-menu__icon browse-all-contacts'></div>
                                    Browse <br /> all contacts
                                </Link>
                            </>
                        )}
                        <Link
                            to='inventory/create'
                            className='common-tasks-menu__item cursor-pointer'
                        >
                            <div className='common-tasks-menu__icon new-inventory'></div>
                            New inventory
                        </Link>
                        <Link to='inventory' className='common-tasks-menu__item cursor-pointer'>
                            <div className='common-tasks-menu__icon browser-all-inventory'></div>
                            Browse <br /> all inventory
                        </Link>
                        {isSalesPerson || (
                            <>
                                <Link
                                    to='deals/create'
                                    className='common-tasks-menu__item cursor-pointer'
                                >
                                    <div className='common-tasks-menu__icon new-deal'></div>
                                    New deal
                                </Link>
                                <Link to='deals' className='common-tasks-menu__item cursor-pointer'>
                                    <div className='common-tasks-menu__icon browse-all-deals'></div>
                                    Browse <br /> all deals
                                </Link>
                            </>
                        )}
                        <Link to='test-drive' className='common-tasks-menu__item cursor-pointer'>
                            <div className='common-tasks-menu__icon print-test-drive'></div>
                            Print <br /> (for test drive)
                        </Link>
                    </div>
                </div>
            </div>
            <div className='col-12'>
                <div className='card'>
                    <div className='card-content'>
                        <div className='grid justify-content-between'>
                            <div className='col-12 md:col-9'>
                                <TasksWidget />
                            </div>
                            <div className='col-12 md:col-3 md:text-right task-calendar p-0'>
                                <Calendar className='task-calendar__input' value={date} inline />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-12 xl:col-5'>
                <RecentMessages />
            </div>
            <div className='col-12 xl:col-4'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Recently added contact</h2>
                    </div>
                    <div className='card-content'>
                        <dl className='contact-item flex'>
                            <dt className='contact-item__label'>Name:</dt>
                            <dd>Johnny Walker</dd>
                        </dl>
                        <dl className='contact-item flex'>
                            <dt className='contact-item__label'>Phone:</dt>
                            <dd>631-429-6822</dd>
                        </dl>
                        <dl className='contact-item flex'>
                            <dt className='contact-item__label'>E-mail:</dt>
                            <dd>walkerjohnny@hotmail.com</dd>
                        </dl>
                        <dl className='contact-item flex'>
                            <dt className='contact-item__label'>Date & time:</dt>
                            <dd>26, April 2023</dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className='col-12 xl:col-3'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='uppercase m-0'>Printing</h2>
                    </div>
                    <div className='card-content'>
                        <ul className='list-none pl-0 printing-menu'>
                            <li className='printing-menu__item'>
                                <i className='adms-email printing-menu__icon' />
                                Mailings
                            </li>
                            <li className='printing-menu__item '>
                                <i className='adms-blank printing-menu__icon' />
                                Blank credit application
                            </li>
                            <li className='printing-menu__item'>
                                <i className='adms-print printing-menu__icon' />
                                Print "Initial privacy notice"
                            </li>
                            <li className='printing-menu__item'>
                                <i className='adms-print printing-menu__icon' />
                                Print deal forms
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
