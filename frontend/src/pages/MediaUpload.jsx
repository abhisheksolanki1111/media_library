import { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { uploadMedia } from '../api/media';
import { useNavigate } from 'react-router-dom';

const MediaUpload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [expiryTime, setExpiryTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { isUploader } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await uploadMedia(file, title, expiryTime);
            setSuccess('Media uploaded successfully!');
            setFile(null);
            setTitle('');
            setExpiryTime('');
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isUploader()) {
        navigate('/');
        return null;
    }

    return (
        <>
            <Container className="mt-4" style={{ maxWidth: '600px' }}>
                <h2 className="mb-4">Upload Media</h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Media File (Image/Video)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formExpiryTime">
                        <Form.Label>Expiry Date & Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={expiryTime}
                            onChange={(e) => setExpiryTime(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                <span className="ms-2">Uploading...</span>
                            </>
                        ) : (
                            'Upload'
                        )}
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default MediaUpload;