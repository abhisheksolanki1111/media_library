
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Spinner, Alert } from 'react-bootstrap';
import { getMedia, getMediaUrl } from '../api/media';
import { useAuth } from '../context/AuthContext';

const MediaGallery = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const { isAuthenticated } = useAuth();
    console.log(selectedMedia,'selectedMedia');

    useEffect(() => {
        if (!isAuthenticated()) return;

        const fetchMedia = async () => {
            try {
                const data = await getMedia();
                console.log(data,'data');
                
                setMedia(data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load media');
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, [isAuthenticated]);

    if (!isAuthenticated()) {
        return null;
    }

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <>
            <Container className="mt-4">
                <h2 className="mb-4">Media Gallery</h2>

                {media.length === 0 ? (
                    <Alert variant="info">No media files available</Alert>
                ) : (
                    
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {media.map((item) => (
                            <Col key={item.id}>
                                <Card onClick={() => setSelectedMedia(item)} style={{ cursor: 'pointer' }}>
                                    {item.path ? (
                                        <Card.Img variant="top" src={getMediaUrl(item.path)} />
                                    ) : item.mime_type.startsWith('video/') ? (
                                        <div className="text-center p-4 bg-light">
                                            <i className="bi bi-file-earmark-play-fill" style={{ fontSize: '3rem' }}></i>
                                        </div>
                                    ) : (
                                        <div className="text-center p-4 bg-light">
                                            <i className="bi bi-file-earmark" style={{ fontSize: '3rem' }}></i>
                                        </div>
                                    )}
                                    <Card.Body>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Text>
                                            Expires: {new Date(item.expiry_time).toLocaleString()}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                <Modal show={!!selectedMedia} onHide={() => setSelectedMedia(null)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedMedia?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        {selectedMedia ? (
                            selectedMedia.mime_type.startsWith('image/') ? (
                                <img
                                    src={getMediaUrl(selectedMedia.path)}
                                    alt={selectedMedia.title}
                                    style={{ maxWidth: '100%' }}
                                />
                            ) : selectedMedia.mime_type.startsWith('video/') ? (
                                <video controls style={{ maxWidth: '100%' }}>
                                    <source src={getMediaUrl(selectedMedia.path)} type={selectedMedia.mime_type} />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="p-4">
                                    <i className="bi bi-file-earmark" style={{ fontSize: '5rem' }}></i>
                                    <p>Preview not available</p>
                                </div>
                            )
                        ) : (
                            <div className="p-4">
                                <i className="bi bi-file-earmark" style={{ fontSize: '5rem' }}></i>
                                <p>Preview not available</p>
                            </div>
                        )}
                    </Modal.Body>

                </Modal>
            </Container>
        </>
    );
};

export default MediaGallery;