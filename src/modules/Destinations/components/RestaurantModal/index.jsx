import {
	Box,
	Button,
	Flex,
	Grid,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from '@chakra-ui/react';
import styles from './index.module.scss';
import { FaLocationDot } from 'react-icons/fa6';
import { Gallery } from '../Gallery';
import { GiForkKnifeSpoon } from 'react-icons/gi';
import { MdOutlineRoomService } from 'react-icons/md';
import { FaRadio } from 'react-icons/fa6';

export function RestaurantModal({
	isOpen,
	onClose,
	title,
	rating,
	reviewsCount,
	address,
	images,
	rateFood,
	rateService,
	rateValue,
	overallRate,
	openTime,
	phone,
	cuisines,
	locationId,
}) {
	return (
		<Modal onClose={onClose} isOpen={isOpen}>
			<ModalOverlay />
			<ModalContent minW="700px">
				<ModalCloseButton />
				<ModalBody px="20px" py="30px">
					<h2 className={styles.title}>{title}</h2>
					<Flex alignItems="center" mt={2} gap="2">
						<Flex alignItems="center" gap={1}>
							{Array.from(
								Array(rating > 5 ? 5 : Math.floor(rating || 0)).keys(),
							).map((value) => (
								<Box
									key={value}
									w="12px"
									h="12px"
									bg="#00AA6C"
									border="1px solid #00AA6C"
									borderRadius="50%"
								/>
							))}

							{Array.from(
								Array(5 - (rating > 5 ? 5 : Math.floor(rating || 0))).keys(),
							).map((value) => (
								<Box
									key={value}
									w="12px"
									h="12px"
									bg="#fff"
									borderRadius="50%"
									border="1px solid #00AA6C"
								/>
							))}
						</Flex>
						<Text fontSize="small" color="#333">
							{reviewsCount}
						</Text>
					</Flex>
					<Flex alignItems="center" mt={2} gap={1}>
						<FaLocationDot size="16px" />
						<Text fontSize="small">{address}</Text>
					</Flex>
					<Box mt="3">
						<Gallery images={images} size="sm" />
					</Box>
					<Grid templateColumns="repeat(2, 1fr)" mt={5}>
						<Flex flexDirection="column">
							<Text fontSize="medium" fontWeight="500" color="gray">
                평가 및 리뷰
							</Text>

							<Flex alignItems="center" mt={2} gap={2}>
								{rating}

								<Flex alignItems="center" gap={1}>
									{Array.from(
										Array(rating > 5 ? 5 : Math.floor(rating || 0)).keys(),
									).map((value) => (
										<Box
											key={value}
											w="18px"
											h="18px"
											bg="#00AA6C"
											border="1px solid #00AA6C"
											borderRadius="50%"
										/>
									))}

									{Array.from(
										Array(
											5 - (rating > 5 ? 5 : Math.floor(rating || 0)),
										).keys(),
									).map((value) => (
										<Box
											key={value}
											w="18px"
											h="18px"
											bg="#fff"
											border="1px solid #00AA6C"
											borderRadius="50%"
										/>
									))}
								</Flex>
								<Text fontSize="small" color="#333">
									{reviewsCount}
								</Text>
							</Flex>

							<Box mt="14px" fontSize="small">
								{overallRate}
							</Box>

							<Flex flexDirection="column" mt={6} w="100%">
								<Text fontSize="medium">평점</Text>

								<Flex flexDirection="column" mt={3} gap={3} w="100%">
									<Flex alignItems="center" gap={2}>
										<GiForkKnifeSpoon />{' '}
										<Text color="#5C5F79" w="70px">
                      음식
										</Text>
										<img src={rateFood?.rating_image_url} />
									</Flex>

									<Flex alignItems="center" gap={2}>
										<MdOutlineRoomService />{' '}
										<Text color="#5C5F79" w="70px" c>
                      서비스
										</Text>
										<img src={rateService?.rating_image_url} />
									</Flex>

									<Flex alignItems="center" gap={2}>
										<FaRadio />{' '}
										<Text color="#5C5F79" w="70px">
                      가격
										</Text>
										<img src={rateValue?.rating_image_url} />
									</Flex>

									{/* <div className="flex gap-2 items-center">
                <ForkIcon />
                <span className="text-[#5C5F79] w-[70px]">분위기</span>
              </div> */}
								</Flex>
							</Flex>
						</Flex>

						<Flex flexDirection="column">
							<Text fontSize="medium" color="gray" fontWeight="500">
                상세정보
							</Text>
							<Flex flexDirection="column" mt={3}>
								<Text fontSize="13px" fontWeight="500">
                  영업시간
								</Text>
								<Text fontSize="13px">오전 {openTime}에 영업 시작</Text>
							</Flex>
							<Flex flexDirection="column" mt={3}>
								<Text
									fontSize="13px"
									fontWeight="500"
									className="text-[13px] font-medium"
								>
                  전화번호
								</Text>
								<Text fontSize="13px" className="text-[13px] font-normal">
									{phone}
								</Text>
							</Flex>
							{cuisines?.length > 0 && (
								<Flex flexDirection="column" mt={3}>
									<Text
										fontSize="13px"
										fontWeight="500"
										className="text-[13px] font-medium"
									>
                    요리
									</Text>
									<Text fontSize="13px" className="text-[13px] font-normal">
										{cuisines}
									</Text>
								</Flex>
							)}
						</Flex>
					</Grid>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
