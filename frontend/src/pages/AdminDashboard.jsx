
import { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { getExpiredMedia, deleteMedia } from '../api/media';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [expiredMedia, setExpiredMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [mediaToDelete, setMediaToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    console.log('expiredMedia', expiredMedia);

    useEffect(() => {
        if (!isAdmin()) return;

        const fetchExpiredMedia = async () => {
            try {
                const data = await getExpiredMedia();
                console.log(data,'data');
                
                setExpiredMedia(data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load expired media');
            } finally {
                setLoading(false);
            }
        };

        fetchExpiredMedia();
    }, [isAdmin]);

    const handleDelete = async () => {
        if (!mediaToDelete) return;

        setDeleting(true);
        try {
            await deleteMedia(mediaToDelete.id);
            setExpiredMedia(expiredMedia.filter(item => item.id !== mediaToDelete.id));
            setShowDeleteModal(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete media');
        } finally {
            setDeleting(false);
            setMediaToDelete(null);
        }
    };

    if (!isAdmin()) {
        navigate('/');
        return null;
    }

    return (
        <>
            <Container className="mt-4">
                <h2 className="mb-4">Admin Dashboard - Expired Media</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : expiredMedia.length === 0 ? (
                    <Alert variant="info">No expired media files</Alert>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Uploaded By</th>
                                <th>Expired On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expiredMedia.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.mime_type.split('/')[0]}</td>
                                    <td>{item.user?.name }</td>
                                    <td>{new Date(item.expiry_time).toLocaleString()}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => {
                                                setMediaToDelete(item);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete "{mediaToDelete?.title}"? This action cannot be undone.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default AdminDashboard;